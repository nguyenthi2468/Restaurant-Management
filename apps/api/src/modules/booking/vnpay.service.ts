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
    // Config values are required; use non‑null assertion to satisfy TypeScript
    this.tmnCode = this.configService.get<string>('VNP_TMN_CODE')!;
    this.hashSecret = this.configService.get<string>('VNP_HASH_SECRET')!;
    this.vnpUrl = this.configService.get<string>('VNP_URL')!;
    this.returnUrl = this.configService.get<string>('VNP_RETURN_URL')!;
  }

  /**
   * Generate VNPay payment URL.
   * @param amount   Amount in VND (integer).
   * @param orderId  Unique order identifier.
   * @param orderInfo Description of the order.
   */
  createPaymentUrl(amount: number, orderId: string, orderInfo: string): string {
    const createDate = this.formatDate(new Date());
    console.log(this.tmnCode, this.hashSecret, this.vnpUrl, this.returnUrl); // Debug log to verify config values
    const vnpParams: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: amount * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn', // ← thêm dòng này
      vnp_CreateDate: createDate,
      vnp_IpAddr: '127.0.0.1',
      vnp_ReturnUrl: this.returnUrl,
    };

    const sortedParams = this.sortParams(vnpParams);
    const queryStr = this.buildQueryString(sortedParams);
    const signature = this.generateSignature(queryStr);

    return `${this.vnpUrl}?${queryStr}&vnp_SecureHash=${signature}`;
  }

  // Ensure a newline before the next method for readability
  // (ESLint rule: newline-before-return)

  /**
   * Verify VNPay response signature.
   * @param params All query parameters returned by VNPay (including vnp_SecureHash).
   */
  verifyResponse(params: Record<string, any>): boolean {
    const { vnp_SecureHash, ...data } = params;
    const sortedParams = this.sortParams(data);
    const queryStr = this.buildQueryString(sortedParams);
    const expectedSignature = this.generateSignature(queryStr);
    return vnp_SecureHash === expectedSignature;
  }

  private generateSignature(queryStr: string): string {
    return crypto
      .createHmac('sha512', this.hashSecret)
      .update(queryStr)
      .digest('hex');
  }

  private sortParams(params: Record<string, any>): string[] {
    return Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`);
  }

  private buildQueryString(sortedParams: string[]): string {
    return sortedParams.join('&');
  }

  private formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date(date.getTime() + 7 * 60 * 60 * 1000); // UTC+7
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
