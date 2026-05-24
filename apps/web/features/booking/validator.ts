import { z } from 'zod';
import { BookingStatus, DepositStatus } from './types';

export const bookingTableSchema = z.object({
  tableId: z.string().min(1, 'Table ID là bắt buộc'),
});

export const bookingMenuItemSchema = z.object({
  menuItemId: z.string().min(1, 'Menu Item ID là bắt buộc'),
  quantity: z.number().int().min(1, 'Số lượng phải lớn hơn 0'),
  price: z.coerce.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
});

export const bookingFormSchema = z
    .object({
      customerId: z.string().optional(),
      customerName: z.string().min(1, 'Họ và tên là bắt buộc'),
      customerPhone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
      customerEmail: z.string().email('Email không hợp lệ'),
      bookingTime: z.date({
        message: 'Ngày đến là bắt buộc',
      }),
      numberOfGuests: z.number().int().min(1, 'Số lượng khách phải lớn hơn 0'),
      numberOfChildren: z
        .number()
        .int()
        .min(0, 'Số lượng trẻ em không được âm')
        .optional()
        .default(0),
      note: z.string().optional(),
      depositAmount: z.number().min(0, 'Số tiền cọc không được âm').optional(),
      depositStatus: z.nativeEnum(DepositStatus).optional(),
      status: z.nativeEnum(BookingStatus).optional(),
      tables: z.array(bookingTableSchema).min(1, 'Phải chọn ít nhất một bàn'),
      preOrderItems: z.array(bookingMenuItemSchema).optional(),
    })

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type BookingTableFormValues = z.infer<typeof bookingTableSchema>;
export type BookingMenuItemFormValues = z.infer<typeof bookingMenuItemSchema>;
