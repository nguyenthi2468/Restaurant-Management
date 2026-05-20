import { z } from 'zod';

export const ingredientSchema = z.object({
  id: z.string().optional(),
  ingredientName: z.string().min(1, 'Tên nguyên liệu là bắt buộc'),
  quantity: z.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
  unit: z.string().min(1, 'Đơn vị tính là bắt buộc'),
  isAllergen: z.boolean().optional().default(false),
});

export const optionValueSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên giá trị là bắt buộc'),
  description: z.string().optional(),
  priceAdjustment: z.number().default(0),
  position: z.number().int().min(0).optional().default(0),
});

export const optionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên tùy chọn là bắt buộc'),
  description: z.string().optional(),
  group: z.string().optional(),
  isRequired: z.boolean().optional().default(false),
  position: z.number().int().min(0).optional().default(0),
  values: z.array(optionValueSchema).min(1, 'Phải có ít nhất một giá trị'),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Tên món ăn là bắt buộc'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  categoryId: z.string().min(1, 'Danh mục là bắt buộc'),
  imageId: z.string().optional(),
  position: z.number().int().min(0).optional().default(0),
  isAvailable: z.boolean().optional().default(true),
  isVegetarian: z.boolean().optional().default(false),
  isVegan: z.boolean().optional().default(false),
  isGlutenFree: z.boolean().optional().default(false),
  isSpicy: z.boolean().optional().default(false),
  preparationTime: z.number().int().min(0).optional(),
  ingredients: z.array(ingredientSchema).optional().default([]),
  options: z.array(optionSchema).optional().default([]),
});

export type IngredientFormValues = z.input<typeof ingredientSchema>;
export type OptionValueFormValues = z.input<typeof optionValueSchema>;
export type OptionFormValues = z.input<typeof optionSchema>;
export type MenuItemFormValues = z.input<typeof menuItemSchema>;
