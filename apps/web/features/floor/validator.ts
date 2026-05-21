import { z } from 'zod';

export const floorSchema = z.object({
  name: z.string().min(1, 'Tên tầng là bắt buộc'),
});

export type FloorFormValues = z.infer<typeof floorSchema>;
