import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Booking } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly cfg: ConfigService,
  ) {}
  async sendVerifyEmail(to: string, link: string) {
    const logo = this.cfg.get<string>('BRAND_LOGO_URL');
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6">
        <img src="${logo}" alt="Stayra" height="40"/>
        <h2>Verify your email</h2>
        <p>Thanks for signing up. Click the button below to verify your email:</p>
        <p><a href="${link}" style="display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;background:#111;color:#fff">Verify Email</a></p>
        <p>This link expires in 30 minutes.</p>
        <hr/><small>If you did not sign up, please ignore this.</small>
      </div>`;
    await this.mailer.sendMail({
      to,
      subject: 'Verify your email – Stayra',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    console.log('Working ...');
    const brand = process.env.BRAND_NAME ?? 'Stayra';
    const from = process.env.MAIL_FROM ?? 'no-reply@stayra.com';
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto">
        <h2>${brand} password reset</h2>
        <p>We received a request to reset your password.</p>
        <p>This link will expire in 30 minutes.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 16px;text-decoration:none;border:1px solid #333">
          Reset your password
        </a></p>
        <p>If you didn’t request this, please ignore this email.</p>
      </div>
    `;
    await this.mailer.sendMail({
      to,
      from,
      subject: `${brand} - Reset your password`,
      html,
    });
  }

  async sendPaymentSucceededEmail(input: {
    to: string;
    guestName?: string | null;
    bookingId: string;
    amountVnd: string; // đã format
    hotelName?: string | null;
    checkIn?: string;
    checkOut?: string;
  }) {
    const brand = this.cfg.get<string>('BRAND_NAME') ?? 'Stayra';
    const logo = this.cfg.get<string>('BRAND_LOGO_URL');

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;max-width:640px;margin:auto">
        ${logo ? `<img src="${logo}" alt="${brand}" height="40" style="margin-bottom:12px"/>` : ''}
        <h2>Thanh toán thành công 🎉</h2>

        <p>Chào ${input.guestName ?? 'bạn'},</p>
        <p>Bọn mình đã ghi nhận <b>thanh toán thành công</b> cho booking <b>${input.bookingId}</b>.</p>

        <div style="padding:12px 14px;border:1px solid #eee;border-radius:10px">
          <p style="margin:0"><b>Khách sạn:</b> ${input.hotelName ?? '-'}</p>
          <p style="margin:0"><b>Check-in:</b> ${input.checkIn ?? '-'}</p>
          <p style="margin:0"><b>Check-out:</b> ${input.checkOut ?? '-'}</p>
          <p style="margin:8px 0 0 0"><b>Số tiền:</b> ${input.amountVnd} VND</p>
        </div>

        <p style="margin-top:14px">Cảm ơn bạn đã sử dụng ${brand}.</p>
        <hr/>
        <small>Nếu bạn không thực hiện giao dịch này, vui lòng liên hệ hỗ trợ.</small>
      </div>
    `;

    await this.mailer.sendMail({
      to: input.to,
      subject: `Thanh toán thành công – ${brand}`,
      html,
    });
  }

  async sendContactNotification(input: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    subject?: string;
    message: string;
    createdAt: Date;
  }) {
    const to = process.env.SUPPORT_EMAIL || process.env.SMTP_USER;

    const subject = `[Contact] ${input.subject ?? 'New message'} (#${input.id})`;
    const text = `New contact message
          Name: ${input.name}
          Email: ${input.email ?? '-'}
          Phone: ${input.phone ?? '-'}
          Subject: ${input.subject ?? '-'}

          Message:
          ${input.message}

          At: ${input.createdAt.toISOString()}
          `;

    await this.mailer.sendMail({ to, subject, text }); // dùng hàm sendMail bạn đã có
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmationEmail(
    booking: Booking & { bookingTables: { table: { name: string } }[] },
  ) {
    const email = booking.customerEmail;
    if (!email) {
      return;
    }

    const tables = booking.bookingTables.map((bt) => bt.table.name).join(', ');

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;max-width:640px;margin:auto">
        <h2>✅ Xác nhận đặt bàn thành công</h2>
        <p>Chào ${booking.customerName},</p>
        <p>Cảm ơn bạn đã đặt bàn tại nhà hàng của chúng tôi. Đặt bàn của bạn đã được xác nhận:</p>
        
        <div style="padding:16px;border:1px solid #eee;border-radius:10px;background:#f9f9f9">
          <p style="margin:0 0 8px 0"><b>Mã đặt bàn:</b> ${booking.id}</p>
          <p style="margin:0 0 8px 0"><b>Thời gian bắt đầu:</b> ${new Date(booking.bookingTime).toLocaleString('vi-VN')}</p>
          <p style="margin:0 0 8px 0"><b>Số lượng khách:</b> ${booking.numberOfGuests} người (${booking.numberOfChildren} trẻ em)</p>
          <p style="margin:0 0 8px 0"><b>Bàn:</b> ${tables}</p>
          ${booking.note ? `<p style="margin:0 0 8px 0"><b>Ghi chú:</b> ${booking.note}</p>` : ''}
        </div>

        <p style="margin-top:16px">Chúng tôi sẽ giữ bàn cho bạn đúng thời gian đã đặt. Nếu có bất kỳ thay đổi nào, vui lòng liên hệ với chúng tôi.</p>
        
        <hr style="border:0;border-top:1px solid #eee;margin:24px 0"/>
        <small style="color:#666">Đây là email tự động. Vui lòng không trả lời email này.</small>
      </div>
    `;

    await this.mailer.sendMail({
      to: email,
      subject: `Xác nhận đặt bàn thành công - ${booking.id}`,
      html,
    });
  }

  async sendBookingConfirmationBookedEmail(
    booking: Booking & { bookingTables: { table: { name: string } }[] },
  ) {
    const email = booking.customerEmail;
    if (!email) {
      return;
    }

    const tables = booking.bookingTables.map((bt) => bt.table.name).join(', ');

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;max-width:640px;margin:auto">
        <h2>✅ Đặt bàn của bạn đã được xác nhận</h2>
        <p>Chào ${booking.customerName},</p>
        <p>Cảm ơn bạn đã đặt bàn tại nhà hàng của chúng tôi.</p>
        
        <p>Bọn mình đã ghi nhận đặt bàn của bạn và sẽ xác nhận trong <b>24 giờ</b>. Khi đặt bàn được xác nhận, bạn sẽ nhận được email thông báo.</p>
        
        <div style="padding:16px;border:1px solid #eee;border-radius:10px;background:#f9f9f9">
          <p style="margin:0 0 8px 0"><b>Mã đặt bàn:</b> ${booking.id}</p>
          <p style="margin:0 0 8px 0"><b>Thời gian bắt đầu:</b> ${new Date(booking.bookingTime).toLocaleString('vi-VN')}</p>
          <p style="margin:0 0 8px 0"><b>Số lượng khách:</b> ${booking.numberOfGuests} người (${booking.numberOfChildren} trẻ em)</p>
          <p style="margin:0 0 8px 0"><b>Bàn:</b> ${tables}</p>
          ${booking.note ? `<p style="margin:0 0 8px 0"><b>Ghi chú:</b> ${booking.note}</p>` : ''}
        </div>

        <p style="margin-top:16px">Nếu có bất kỳ thay đổi nào, vui lòng liên hệ với chúng tôi qua email nguyenthi24683579@gmail.com.</p>
        
        <hr style="border:0;border-top:1px solid #eee;margin:24px 0"/>
        <small style="color:#666">Đây là email tự động. Vui lòng không trả lời email này.</small>
      </div>
    `;

    await this.mailer.sendMail({
      to: email,
      subject: `Đặt bàn của bạn đã được xác nhận - ${booking.id}`,
      html,
    });
  }
}
