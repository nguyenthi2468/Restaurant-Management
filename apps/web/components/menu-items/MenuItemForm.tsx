'use client';
import React, { useState } from 'react';
import GalleryImageDialog from '@/components/common/GalleryImageDialog';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { Loader2, ImageIcon, FileText, Settings, Utensils } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { menuItemSchema, MenuItemFormValues } from '@/features/menu-items';
import { useMenuCategoriesQuery } from '@/features/menu-categories';
import MenuItemIngredientsSection from './MenuItemIngredientsSection';
import { formatNumber, parseCurrency } from '@/utils/currency';

interface MenuItemFormProps {
  menuItem?: MenuItemFormValues;
  initialImageUrl?: string;
  onSubmit: (data: MenuItemFormValues) => Promise<void>;
  isSubmitting: boolean;
}

function MenuItemForm({
  menuItem,
  initialImageUrl,
  onSubmit,
  isSubmitting,
}: MenuItemFormProps) {
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: menuItem || {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      imageId: '',
      position: 0,
      isAvailable: true,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: undefined,
      ingredients: [],
    },
  });

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialImageUrl || null,
  );
  const { data: categories } = useMenuCategoriesQuery();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <div className="bg-muted/20 p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-foreground font-semibold text-lg border-b pb-4">
              <FileText className="w-5 h-5 text-primary" />
              Thông tin cơ bản
            </div>

            <div className="space-y-6">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">
                      Tên món ăn
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nhập tên món ăn"
                      className="bg-background shadow-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">
                      Mô tả
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nhập mô tả"
                      className="bg-background shadow-sm"
                    />
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">
                      Giá (VND)
                    </FieldLabel>
                    <Input
                      type="text"
                      min={0}
                      placeholder="299000"
                      {...field}
                      value={formatNumber(Number(field.value))}
                      onBlur={(e) =>
                        field.onChange(Number(parseCurrency(e.target.value)))
                      }
                      onChange={(e) =>
                        field.onChange(Number(parseCurrency(e.target.value)))
                      }
                    />
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="mb-2 inline-block font-medium">
                      Danh mục
                    </FieldLabel>
                    <select
                      {...field}
                      className="w-full px-3 py-2 bg-background border rounded-md shadow-sm"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive mt-1 block font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-muted/20 p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold text-lg border-b pb-4 mb-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Hình ảnh
            </div>
            <Controller
              control={form.control}
              name="imageId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-col gap-4">
                    <div className="h-48 w-full relative border-2 border-dashed rounded-lg overflow-hidden bg-background flex flex-col items-center justify-center group transition-colors hover:border-primary/50">
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt="Selected image"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => setIsGalleryOpen(true)}
                              className="font-medium shadow-md"
                            >
                              Đổi hình ảnh
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div
                          className="text-center p-4 flex flex-col items-center text-muted-foreground cursor-pointer"
                          onClick={() => setIsGalleryOpen(true)}
                        >
                          <div className="bg-muted p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium">
                            Chưa có hình ảnh
                          </span>
                          <span className="text-xs text-muted-foreground/70 mt-1">
                            Nhấn để chọn
                          </span>
                        </div>
                      )}
                    </div>
                    {imageUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full font-medium"
                        onClick={() => {
                          form.setValue('imageId', '');
                          setImageUrl(null);
                        }}
                      >
                        Xóa hình ảnh
                      </Button>
                    )}
                    {fieldState.invalid && (
                      <span className="text-xs text-destructive block text-center font-medium">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </div>
                  <GalleryImageDialog
                    open={isGalleryOpen}
                    onOpenChange={setIsGalleryOpen}
                    initialSelected={
                      field.value
                        ? { id: field.value, url: imageUrl || '' }
                        : null
                    }
                    onConfirm={(image) => {
                      if (image) {
                        form.setValue('imageId', image.id || '');
                        setImageUrl(image.url);
                      } else {
                        form.setValue('imageId', '');
                        setImageUrl(null);
                      }
                      setIsGalleryOpen(false);
                    }}
                  />
                </Field>
              )}
            />
          </div>

          <div className="bg-muted/20 p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold text-lg border-b pb-4 mb-2">
              <Settings className="w-5 h-5 text-primary" />
              Cài đặt
            </div>

            <Controller
              control={form.control}
              name="position"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-2 inline-block font-medium">
                    Vị trí hiển thị
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    className="bg-background shadow-sm"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Số nhỏ hơn hiển thị trước
                  </p>
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive mt-1 block font-medium">
                      {fieldState.error?.message}
                    </span>
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="preparationTime"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="mb-2 inline-block font-medium">
                    Thời gian chuẩn bị (phút)
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="15"
                    className="bg-background shadow-sm"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ''
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                    value={field.value ?? ''}
                  />
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive mt-1 block font-medium">
                      {fieldState.error?.message}
                    </span>
                  )}
                </Field>
              )}
            />

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm border-b pb-2">
                <Utensils className="w-4 h-4 text-primary" />
                Đặc điểm món ăn
              </div>

              <Controller
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                    <div className="space-y-1">
                      <FieldLabel className="text-sm font-medium">
                        Có sẵn
                      </FieldLabel>
                      <p className="text-xs text-muted-foreground">
                        Món ăn có sẵn để đặt
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isVegetarian"
                render={({ field }) => (
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                    <FieldLabel className="text-sm font-medium">
                      Món chay
                    </FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isVegan"
                render={({ field }) => (
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                    <FieldLabel className="text-sm font-medium">
                      Món thuần chay
                    </FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isGlutenFree"
                render={({ field }) => (
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                    <FieldLabel className="text-sm font-medium">
                      Không gluten
                    </FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <Controller
                control={form.control}
                name="isSpicy"
                render={({ field }) => (
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm">
                    <FieldLabel className="text-sm font-medium">
                      Món cay
                    </FieldLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <MenuItemIngredientsSection control={form.control} />

      <div className="flex items-center justify-end pt-6 border-t gap-3 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[160px] shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>{menuItem ? 'Lưu thay đổi' : 'Tạo món ăn'}</>
          )}
        </Button>
      </div>
    </form>
  );
}

export default MenuItemForm;
