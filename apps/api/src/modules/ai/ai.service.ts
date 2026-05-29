import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    baseURL: `${process.env.NINEROUTER_URL}/v1`,
    apiKey: process.env.NINEROUTER_KEY,
  });

  constructor(private prisma: PrismaService) {}
  async getSchema(): Promise<string> {
    // Lấy toàn bộ table schema từ Postgres
    const tables = await this.prisma.$queryRaw<any[]>`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;

    // Format thành text cho AI đọc
    const grouped = tables.reduce((acc, row) => {
      if (!acc[row.table_name]) acc[row.table_name] = [];
      acc[row.table_name].push(`  ${row.column_name} (${row.data_type})`);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(
        ([table, cols]) => `Table ${table}:\n${(cols as string[]).join('\n')}`,
      )
      .join('\n\n');
  }
  async chat(message: string) {
    const dbSchema = await this.getSchema();

    // Bước 1: AI generate SQL (1 call duy nhất)
    const response = await this.openai.chat.completions.create({
      model: 'gemini',
      messages: [
        {
          role: 'system',
          content: `
            Bạn là chuyên gia PostgreSQL.
            Nhiệm vụ của bạn là generate câu lệnh SQL dựa trên schema database được cung cấp.
            Luôn sử dụng dấu ngoặc kép " cho TẤT CẢ identifier:
            tên bảng
            tên cột
            alias

            Ví dụ:

            SAI:
            SELECT o.orderId, oi.menuItemId

            ĐÚNG:
            SELECT o."orderId", oi."menuItemId"

            PostgreSQL phân biệt chữ hoa chữ thường với identifier.
            Phải dùng CHÍNH XÁC tên cột và tên bảng từ schema.

            Ví dụ:

            đúng: "createdAt"
            sai: "createdat" hoặc "created_at"
            Không được tự tạo:
            tên bảng
            tên cột
            foreign key
            alias không tồn tại

            Chỉ được sử dụng dữ liệu có trong schema.

            Khi JOIN bảng:
            phải kiểm tra foreign key có tồn tại thật trong schema
            không được đoán tên cột

            Ví dụ:

            đúng: "orderId"
            sai: "order_id" hoặc "orderid"
            Chỉ generate DUY NHẤT một câu SQL.

            Không được:

            generate nhiều query
            dùng dấu ; để nối nhiều câu lệnh
            Không được trả markdown.

            KHÔNG dùng:






            giải thích ngoài JSON
            text thừa
            TUYỆT ĐỐI không được generate các câu lệnh nguy hiểm hoặc có khả năng phá hủy dữ liệu.

            CẤM sử dụng:

            DELETE
            DROP
            TRUNCATE
            ALTER
            CASCADE
            REMOVE
            Không được:
            xóa dữ liệu
            xóa bảng
            xóa schema
            xóa database
            xóa index
            xóa constraint
            thay đổi cấu trúc database
            Nếu yêu cầu của người dùng liên quan đến:
            xóa dữ liệu
            reset dữ liệu
            drop table
            truncate table
            alter schema
            migration nguy hiểm

            thì KHÔNG được generate SQL thật.

            Thay vào đó trả về:

            {
            "sql": "",
            "type": "write",
            "explanation": "Yêu cầu bị từ chối vì có thể gây mất dữ liệu hoặc thay đổi cấu trúc database."
            }

            Chỉ cho phép các loại query an toàn:
            SELECT
            INSERT
            UPDATE
            Với UPDATE:
            bắt buộc phải có WHERE
            không được UPDATE toàn bộ bảng nếu thiếu WHERE
            Không được generate:
            transaction
            procedure
            trigger
            function
            execute dynamic SQL

            Chỉ trả về JSON hợp lệ theo đúng format sau:

            {
            "sql": "SELECT ...",
            "type": "read" | "write",
            "explanation": "..."
            }

            Không được thêm bất kỳ text nào ngoài JSON.
            Không thực hiện generate sql nếu là những câu hỏi ngoài lề không liên quan đến database. 
            ${dbSchema}

            SELECT o."id", o."createdAt", oi."orderId"
            FROM "Order" o
            LEFT JOIN "OrderItem" oi
            ON o."id" = oi."orderId"
          `,
        },
        { role: 'user', content: message },
      ],
    });

    // Bước 2: Parse và execute SQL luôn
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Failed to get valid response from AI service');
    }

    const cleanedContent = content.trim();
    let jsonStr = cleanedContent;

    if (cleanedContent.startsWith('```json')) {
      jsonStr = cleanedContent.slice(7);
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
    } else if (cleanedContent.startsWith('```')) {
      jsonStr = cleanedContent.slice(3);
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
    }

    const { sql, type, explanation } = JSON.parse(jsonStr.trim());

    let data: any;
    if (type === 'read') {
      data = await this.prisma.$queryRawUnsafe(sql);
    } else {
      data = await this.prisma.$executeRawUnsafe(sql);
    }

    return { explanation, data };
  }
}
