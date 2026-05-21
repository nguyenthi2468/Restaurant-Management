import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class VnpayService {
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly vnpUrl: string;
  private readonly returnUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.tmnCode = this.configService.get<string>('VNP_TMN_CODE')!;
    this.hashSecret = this.configService.get<string>('VNP_HASH_SECRET')!;
    this.vnpUrl = this.configService.get<string>('VNP_URL')!;
    this.returnUrl = this.configService.get<string>('VNP_RETURN_URL')!;
  }

  // Hàm encode đúng chuẩn VNPAY: space → "+", các ký tự khác → %XX
  private encodeValue(val: string | number): string {
    return encodeURIComponent(String(val)).replace(/%20/g, '+');
  }

  createPaymentUrl(amount: number, orderId: string, orderInfo: string): string {
    const createDate = this.formatDate(new Date());

    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_CreateDate: createDate,
      vnp_IpAddr: '127.0.0.1',
      vnp_ReturnUrl: this.returnUrl,
    };

    const sortedKeys = Object.keys(vnpParams).sort();

    // hashData: space → "+", dùng để ký
    const hashData = sortedKeys
      .map((key) => `${key}=${this.encodeValue(vnpParams[key])}`)
      .join('&');

    // queryString: dùng cho URL (giống hashData vì đã encode)
    const queryString = hashData;

    console.log('hashData:', hashData);

    const signature = this.generateSignature(hashData);
    return `${this.vnpUrl}?${queryString}&vnp_SecureHash=${signature}`;
  }

  verifyResponse(params: Record<string, any>): boolean {
    const { vnp_SecureHash, vnp_SecureHashType, ...data } = params;

    const sortedKeys = Object.keys(data).sort();

    // NestJS đã decode sẵn, cần encode lại đúng chuẩn VNPAY
    const hashData = sortedKeys
      .map((key) => `${key}=${this.encodeValue(data[key])}`)
      .join('&');

    const expectedSignature = this.generateSignature(hashData);
    return vnp_SecureHash === expectedSignature;
  }

  private generateSignature(hashData: string): string {
    return crypto
      .createHmac('sha512', this.hashSecret)
      .update(Buffer.from(hashData, 'utf-8'))
      .digest('hex');
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return (
      d.getUTCFullYear().toString() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds())
    );
  }
}
