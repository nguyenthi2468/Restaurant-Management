import { z } from 'zod';
import { ShiftType } from './types';

export const shiftFormSchema = z.object({
  name: z.string().min(1, 'Tên ca làm việc là bắt buộc'),
  type: z.enum(Object.values(ShiftType), 'Loại ca làm việc là bắt buộc'),
  startTime: z.string().min(1, 'Giờ bắt đầu là bắt buộc'),
  endTime: z.string().min(1, 'Giờ kết thúc là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type ShiftFormValues = z.infer<typeof shiftFormSchema>;

export const assignShiftFormSchema = z.object({
  shiftId: z.string().min(1, 'Ca làm việc là bắt buộc'),
  date: z.string().min(1, 'Ngày là bắt buộc'),
  note: z.string().optional(),
});

export type AssignShiftFormValues = z.infer<typeof assignShiftFormSchema>;
