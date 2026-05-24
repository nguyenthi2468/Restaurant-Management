'use client';
import MenuItemForm from '@/components/menu-items/MenuItemForm';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import {
  MenuItemFormValues,
  useCreateMenuItemMutation,
  useMenuItemQuery,
  useUpdateMenuItemMutation,
} from '@/features/menu-items';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

function MenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = !!id && id !== 'new';
  const createMenuItemMutation = useCreateMenuItemMutation();
  const updateMenuItemMutation = useUpdateMenuItemMutation();
  const { data: menuItem, isLoading, isError } = useMenuItemQuery(id);

  const isSaving =
    createMenuItemMutation.isPending || updateMenuItemMutation.isPending;

  if (isEditing && isLoading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (isEditing && isError) {
    return <div className="p-6">Lỗi khi tải món ăn</div>;
  }

  const initialData: MenuItemFormValues | undefined =
    isEditing && menuItem
      ? {
          name: menuItem.name ?? '',
          description: menuItem.description ?? '',
          price: Number(menuItem.price) ?? 0,
          categoryId: menuItem.categoryId ?? '',
          imageId: menuItem.imageId ?? '',
          position: menuItem.position ?? 0,
          isAvailable: menuItem.isAvailable ?? true,
          isVegetarian: menuItem.isVegetarian ?? false,
          isVegan: menuItem.isVegan ?? false,
          isGlutenFree: menuItem.isGlutenFree ?? false,
          isSpicy: menuItem.isSpicy ?? false,
          preparationTime: menuItem.preparationTime ?? undefined,
          ingredients:
            menuItem.ingredients?.map((ing) => ({
              id: ing.id,
              ingredientName: ing.ingredientName,
              quantity: ing.quantity,
              unit: ing.unit,
              isAllergen: ing.isAllergen,
            })) ?? [],
        }
      : undefined;

  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      if (isEditing) {
        await updateMenuItemMutation.mutateAsync({
          id,
          data,
        });
      } else {
        await createMenuItemMutation.mutateAsync(data);
      }
      router.push(ROUTES.ADMIN_MENU_ITEMS);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-8 flex-col">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.ADMIN_MENU_ITEMS}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Chỉnh sửa món ăn' : 'Tạo món ăn mới'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing
              ? 'Cập nhật thông tin và cài đặt của món ăn này.'
              : 'Thêm món ăn mới vào thực đơn của bạn.'}
          </p>
        </div>
      </div>

      <div className="w-full">
        <MenuItemForm
          menuItem={initialData}
          initialImageUrl={menuItem?.image?.url}
          onSubmit={onSubmit}
          isSubmitting={isSaving}
        />
      </div>
    </div>
  );
}

export default MenuItemPage;
