import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Package } from 'lucide-react';
import { MenuItemFormValues } from '@/features/menu-items';

interface MenuItemIngredientsSectionProps {
  control: Control<MenuItemFormValues>;
}

function MenuItemIngredientsSection({ control }: MenuItemIngredientsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const addIngredient = () => {
    append({
      ingredientName: '',
      quantity: 0,
      unit: '',
      isAllergen: false,
    });
  };

  return (
    <div className="bg-muted/20 p-6 rounded-xl border shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
          <Package className="w-5 h-5 text-primary" />
          Nguyên liệu
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addIngredient}
          className="gap-2"
        >
          <Plus size={16} />
          Thêm nguyên liệu
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa có nguyên liệu nào</p>
          <p className="text-xs mt-1">Nhấn "Thêm nguyên liệu" để bắt đầu</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-background p-4 rounded-lg border space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Nguyên liệu #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel className="mb-2 inline-block font-medium">
                    Tên nguyên liệu
                  </FieldLabel>
                  <Input
                    {...control.register(`ingredients.${index}.ingredientName`)}
                    placeholder="Ví dụ: Sốt cà chua"
                    className="bg-background shadow-sm"
                  />
                </Field>

                <Field>
                  <FieldLabel className="mb-2 inline-block font-medium">
                    Số lượng
                  </FieldLabel>
                  <Input
                    {...control.register(`ingredients.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="0.001"
                    placeholder="0"
                    className="bg-background shadow-sm"
                  />
                </Field>

                <Field>
                  <FieldLabel className="mb-2 inline-block font-medium">
                    Đơn vị
                  </FieldLabel>
                  <Input
                    {...control.register(`ingredients.${index}.unit`)}
                    placeholder="Ví dụ: g, ml, kg"
                    className="bg-background shadow-sm"
                  />
                </Field>
              </div>

              <Field>
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                  <div className="space-y-1">
                    <FieldLabel className="text-sm font-medium">
                      Gây dị ứng
                    </FieldLabel>
                    <p className="text-xs text-muted-foreground">
                      Đánh dấu nếu nguyên liệu này có thể gây dị ứng
                    </p>
                  </div>
                  <Switch
                    {...control.register(`ingredients.${index}.isAllergen`)}
                  />
                </div>
              </Field>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuItemIngredientsSection;
