import { z } from 'zod';
import { TableArea, TableStatus } from './types';

export const tableSchema = z.object({
  name: z.string().min(1, 'Tên bàn là bắt buộc'),
  floor: z.string().min(1, 'Tầng là bắt buộc'),
  area: z.nativeEnum(TableArea).optional().default(TableArea.NORMAL),
  seats: z.number().int().min(1, 'Số ghế phải lớn hơn 0'),
  status: z.nativeEnum(TableStatus).optional().default(TableStatus.AVAILABLE),
});

export type TableFormValues = z.infer<typeof tableSchema>;
