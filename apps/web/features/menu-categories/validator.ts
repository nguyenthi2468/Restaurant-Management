import { z } from 'zod';

export const menuCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
  imageId: z.string().optional(),
  position: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});


export type MenuCategoryFormValues = z.infer<
  typeof menuCategorySchema
>;
