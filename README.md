# Quản lý Nhà hàng

Dự án quản lý nhà hàng bao gồm hai phần chính:

- API backend được xây dựng với NestJS
- Giao diện frontend được xây dựng với Next.js

## Cấu trúc dự án

```
restaurantmanagement/
├── apps/
│   ├── api/          # Ứng dụng NestJS (backend)
│   └── web/          # Ứng dụng Next.js (frontend)
├── package.json      # Cấu hình turbo và workspaces
└── turbo.json        # Cấu hình turbo
```

## Công nghệ sử dụng

### Backend (api)

- NestJS
- TypeScript
- Prisma (ORM)
- PostgreSQL (cơ sở dữ liệu)
- JWT (xác thực)
- Cloudinary (lưu trữ ảnh)

### Frontend (web)

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form
- React Query
- Zod (validation)

## Hướng dẫn cài đặt

1. Clone repository:

   ```bash
   git clone <repository-url>
   cd restaurantmanagement
   ```

2. Cài đặt dependencies:

   ```bash
   npm install
   ```

3. Cài đặt Prisma và tạo cơ sở dữ liệu:

   ```bash
   # Di chuyển vào thư mục api
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Cấu hình biến môi trường:
   - Sao chép file `.env.example` thành `.env` trong thư mục `apps/api` và điền các giá trị cần thiết.
   - Tương tự cho `apps/web` nếu cần.

## Hướng dẫn chạy phát triển

Chạy cả backend và frontend cùng một lúc bằng Turbo:

```bash
# Từ thư mục gốc
npm run dev
```

Hoặc chạy riêng từng phần:

### Backend

```bash
cd apps/api
npm run dev
```

### Frontend

```bash
cd apps/web
npm run dev
```

## Hướng dẫn xây dựng for production

```bash
# Xây dựng cả hai ứng dụng
npm run build

# Hoặc xây dựng riêng
# Backend
cd apps/api
npm run build

# Frontend
cd ../web
npm run build
```

## Các script có sẵn

Trong `package.json` gốc:

- `npm run dev` - Chạy cả backend và frontend ở chế độ développement
- `npm run build` - Xây dựng cả hai ứng dụng để production
- `npm run start` - Chạy cả hai ứng dụng ở chế độ production

Trong `apps/api/package.json`:

- `npm run dev` - Chạy backend ở chế độ development
- `npm run build` - Xây dựng backend
- `npm run start` - Chạy backend ở chế độ production

Trong `apps/web/package.json`:

- `npm run dev` - Chạy frontend ở chế độ development
- `npm run build` - Xây dựng frontend để production
- `npm run start` - Chạy frontend ở chế độ production

## Lưu ý quan trọng

- Đảm bảo rằng bạn đã chạy migrations cho cơ sở dữ liệu trước khi khởi động backend.
- Các biến môi trường cần được cấu hình đúng để ứng dụng hoạt động (xem `.env.example`).
