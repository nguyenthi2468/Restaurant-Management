'use client';
import MenuCategoryForm from "@/components/menucategories/MenuCategoryForm";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { MenuCategoryFormValues, useCreateMenuCategoryMutation, useMenuCategoryQuery, useUpdateMenuCategoryMutation } from "@/features/menu-categories";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

function MenuCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditing = !!id && id !== 'new';
  const createMenuCategoryMutation = useCreateMenuCategoryMutation();
  const updateMenuCategoryMutation = useUpdateMenuCategoryMutation();
  const { data: menuCategory, isLoading, isError } = useMenuCategoryQuery(id);

  const isSaving = createMenuCategoryMutation.isPending || updateMenuCategoryMutation.isPending;

  if (isEditing && isLoading) {
    return <div className="p-6">Loading...</div>;
  }
  
  if (isEditing && isError) {
    return <div className="p-6">Error loading menu category</div>;
  }

  const initialData: MenuCategoryFormValues | undefined = isEditing && menuCategory ? {
    name: menuCategory.name ?? '',
    description: menuCategory.description ?? '',
    imageId: menuCategory.imageId ?? '',
    position: menuCategory.position ?? 0,
    isActive: menuCategory.isActive ?? true,
  } : undefined;

  const onSubmit = async (data: MenuCategoryFormValues) => {
    try {
      if (isEditing) {
        await updateMenuCategoryMutation.mutateAsync({
          id,
          data,
        });
      } else {
        await createMenuCategoryMutation.mutateAsync(data);
      }
       router.push(ROUTES.ADMIN_MENU_CATEGORIES);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-8 flex-col">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.ADMIN_MENU_CATEGORIES}>
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Menu Category' : 'Create Menu Category'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing 
              ? 'Update the details and settings of this category.' 
              : 'Add a new category to organize your menu items.'}
          </p>
        </div>
      </div>

      <div className="w-full">
        <MenuCategoryForm
          menuCategory={initialData}
          initialImageUrl={menuCategory?.image?.secureUrl}
          onSubmit={onSubmit}
          isSubmitting={isSaving}
        />
      </div>
    </div>
  );
}
export default MenuCategoryPage;