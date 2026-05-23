import { z } from 'zod';

export const createOrderFormSchema = z.object({
  tableIds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một bàn'),
  note: z.string().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderFormSchema>;
