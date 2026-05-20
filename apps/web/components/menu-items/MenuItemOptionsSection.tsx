import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { MenuItemFormValues } from '@/features/menu-items';

interface MenuItemOptionsSectionProps {
  control: Control<MenuItemFormValues>;
}

function MenuItemOptionsSection({ control }: MenuItemOptionsSectionProps) {
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: 'options',
  });

  const addOption = () => {
    appendOption({
      name: '',
      description: '',
      group: '',
      isRequired: false,
      position: 0,
      values: [],
    });
  };

  return (
    <div className="bg-muted/20 p-6 rounded-xl border shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
          <Settings2 className="w-5 h-5 text-primary" />
          Tùy chọn món ăn
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="gap-2"
        >
          <Plus size={16} />
          Thêm tùy chọn
        </Button>
      </div>

      {optionFields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Settings2 size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa có tùy chọn nào</p>
          <p className="text-xs mt-1">Ví dụ: Kích thước, Độ cay, Topping</p>
        </div>
      ) : (
        <div className="space-y-6">
          {optionFields.map((optionField, optionIndex) => (
            <OptionItem
              key={optionField.id}
              control={control}
              optionIndex={optionIndex}
              onRemove={() => removeOption(optionIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OptionItemProps {
  control: Control<MenuItemFormValues>;
  optionIndex: number;
  onRemove: () => void;
}

function OptionItem({ control, optionIndex, onRemove }: OptionItemProps) {
  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });

  const addValue = () => {
    appendValue({
      name: '',
      description: '',
      priceAdjustment: 0,
      position: 0,
    });
  };

  return (
    <div className="bg-background p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          Tùy chọn #{optionIndex + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel className="mb-2 inline-block font-medium">Tên tùy chọn</FieldLabel>
          <Input
            {...control.register(`options.${optionIndex}.name`)}
            placeholder="Ví dụ: Kích thước"
            className="bg-muted/30 shadow-sm"
          />
        </Field>

        <Field>
          <FieldLabel className="mb-2 inline-block font-medium">Nhóm</FieldLabel>
          <Input
            {...control.register(`options.${optionIndex}.group`)}
            placeholder="Ví dụ: Size"
            className="bg-muted/30 shadow-sm"
          />
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel className="mb-2 inline-block font-medium">Mô tả</FieldLabel>
          <Input
            {...control.register(`options.${optionIndex}.description`)}
            placeholder="Mô tả tùy chọn"
            className="bg-muted/30 shadow-sm"
          />
        </Field>
      </div>

      <Field>
        <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
          <div className="space-y-1">
            <FieldLabel className="text-sm font-medium">Bắt buộc</FieldLabel>
            <p className="text-xs text-muted-foreground">
              Khách hàng phải chọn tùy chọn này
            </p>
          </div>
          <Switch {...control.register(`options.${optionIndex}.isRequired`)} />
        </div>
      </Field>

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Giá trị</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addValue}
            className="gap-2 h-8"
          >
            <Plus size={14} />
            Thêm giá trị
          </Button>
        </div>

        {valueFields.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-xs">
            Chưa có giá trị nào. Ví dụ: Nhỏ, Vừa, Lớn
          </div>
        ) : (
          <div className="space-y-3">
            {valueFields.map((valueField, valueIndex) => (
              <div
                key={valueField.id}
                className="bg-muted/20 p-3 rounded border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Giá trị #{valueIndex + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeValue(valueIndex)}
                    className="text-destructive hover:text-destructive/80 h-6 w-6 p-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field>
                    <FieldLabel className="mb-1 inline-block text-xs">Tên</FieldLabel>
                    <Input
                      {...control.register(`options.${optionIndex}.values.${valueIndex}.name`)}
                      placeholder="Ví dụ: Nhỏ"
                      className="bg-background shadow-sm h-9 text-sm"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="mb-1 inline-block text-xs">Điều chỉnh giá</FieldLabel>
                    <Input
                      {...control.register(`options.${optionIndex}.values.${valueIndex}.priceAdjustment`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.01"
                      placeholder="0"
                      className="bg-background shadow-sm h-9 text-sm"
                    />
                  </Field>

                  <Field>
                    <FieldLabel className="mb-1 inline-block text-xs">Mô tả</FieldLabel>
                    <Input
                      {...control.register(`options.${optionIndex}.values.${valueIndex}.description`)}
                      placeholder="Mô tả ngắn"
                      className="bg-background shadow-sm h-9 text-sm"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItemOptionsSection;
