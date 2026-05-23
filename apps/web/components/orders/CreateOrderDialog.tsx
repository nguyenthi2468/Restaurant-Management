'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandList, CommandItem } from '@/components/ui/command';
import { Table } from '@/features/tables';
import { useTablesQuery } from '@/features/tables/queries';
import { createOrderFormSchema, CreateOrderFormValues } from '@/features/orders/validator';
import { useCreateOrderMutation } from '@/features/orders/mutations';
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';

interface CreateOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTable: Table;
  onSuccess?: () => void;
}

export function CreateOrderDialog({
  open,
  onOpenChange,
  selectedTable,
  onSuccess,
}: CreateOrderDialogProps) {
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: {
      tableIds: [selectedTable.id],
      note: '',
    },
  });

  const { data: tablesData } = useTablesQuery();
  const createOrderMutation = useCreateOrderMutation();
  const [inputValue, setInputValue] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tables = tablesData?.data || [];

  const handleSubmit = async (values: CreateOrderFormValues) => {
    try {
      await createOrderMutation.mutateAsync({
        tableIds: values.tableIds,
        note: values.note || undefined,
        total: 0,
        items: [],
      });
      toast.success('Tạo đơn hàng thành công');
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Tạo đơn hàng thất bại');
      console.error('Form submission error:', error);
    }
  };

  useEffect(() => {
    if (open && selectedTable) {
      form.reset({
        tableIds: [selectedTable.id],
        note: '',
      });
      setInputValue('');
    }
  }, [open, selectedTable, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng mới</DialogTitle>
          <DialogDescription>
            Chọn bàn và nhập thông tin khách hàng để tạo đơn hàng
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Bàn chính:{' '}
            <span className="font-medium text-foreground">
              {selectedTable.name}
            </span>
          </div>

          <FieldGroup>
            <Controller
              control={form.control}
              name="tableIds"
              render={({ field, fieldState }) => {
                const selectedIds = field.value ?? [];
                const selectedTables: Table[] =
                  tables?.filter((t:Table) => selectedIds.includes(t.id)) || [];

                const filteredSuggestions =
                  tables?.filter(
                    (t: Table) =>
                      t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                      !selectedIds.includes(t.id)
                  ) || [];

                const addTable = (id: string) => {
                  field.onChange([...field.value, id]);
                  setInputValue('');
                  inputRef.current?.focus();
                };

                const removeTable = (id: string) => {
                  if (field.value.length === 1) {
                    toast.error('Phải có ít nhất một bàn');
                    return;
                  }
                  field.onChange(field.value?.filter((tid) => tid !== id) ?? []);
                };

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Bàn (có thể ghép nhiều bàn)</FieldLabel>
                    <div className="space-y-3">
                      {selectedTables.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTables.map((table) => (
                            <Badge
                              key={table.id}
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => removeTable(table.id)}
                            >
                              {table.name} ✕
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="relative">
                        <Input
                          ref={inputRef}
                          placeholder="Tìm kiếm bàn để ghép..."
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                            setOpenPopover(e.target.value.length > 0);
                          }}
                          onFocus={() => {
                            setOpenPopover(true);
                          }}
                          onBlur={() => {
                            setTimeout(() => setOpenPopover(false), 200);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && inputValue.trim()) {
                              e.preventDefault();
                              let found = tables?.find(
                                (t) =>
                                  t.name.toLowerCase() ===
                                  inputValue.toLowerCase()
                              );
                              if (!found && filteredSuggestions.length > 0) {
                                found = filteredSuggestions[0];
                              }
                              if (!found && filteredSuggestions.length === 0) {
                                toast.error('Không tìm thấy bàn');
                              }
                              if (found && !field.value.includes(found.id)) {
                                addTable(found.id);
                              }
                            }
                            if (e.key === 'Escape') {
                              setOpenPopover(false);
                            }
                          }}
                          aria-invalid={fieldState.invalid}
                        />

                        {openPopover && filteredSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <Command>
                              <CommandList>
                                {filteredSuggestions.map((table) => (
                                  <CommandItem
                                    key={table.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      addTable(table.id);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    {table.name}
                                    {table.seats > 0 && (
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({table.seats} người)
                                      </span>
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </div>
                        )}
                      </div>
                      {fieldState.invalid && (
                        <span className="text-xs text-destructive mt-1 block">
                          {fieldState.error?.message}
                        </span>
                      )}
                    </div>
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Ghi chú (tùy chọn)</FieldLabel>
              <Textarea
                {...form.register('note')}
                placeholder="Nhập ghi chú cho đơn hàng"
                rows={3}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={createOrderMutation.isPending}>
              {createOrderMutation.isPending ? 'Đang tạo...' : 'Tạo đơn hàng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
