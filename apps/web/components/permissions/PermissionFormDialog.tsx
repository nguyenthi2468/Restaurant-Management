'use client';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Permission, permissionFormSchema, PermissionFormValues } from '@/features/permissions';

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
  onSubmit: (data: PermissionFormValues) => Promise<void>;
  isSubmitting: boolean;
}

function PermissionFormDialog({
  open,
  onOpenChange,
  permission,
  onSubmit,
  isSubmitting,
}: PermissionFormDialogProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: permission?.name || '',
      description: permission?.description || '',
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name || '',
        description: permission.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [permission, form]);

  const handleSubmit = async (data: PermissionFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const dialogTitle = permission ? 'Edit Permission' : 'Add New Permission';
  const dialogDescription = permission
    ? 'Make changes to the permission information here.'
    : 'Add a new permission to the system.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FieldLabel className="text-right" htmlFor="permission-name">Name</FieldLabel>
                        <div className="col-span-3">
                          <Input id="permission-name" {...field} placeholder="Enter name" aria-invalid={fieldState.invalid} />
                          {fieldState.invalid && (
                            <span className="text-xs text-destructive mt-1 block">
                              {fieldState.error?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FieldLabel className="text-right" htmlFor="permission-description">Description</FieldLabel>
                        <div className="col-span-3">
                          <Input id="permission-description" {...field} placeholder="Enter description" aria-invalid={fieldState.invalid} />
                          {fieldState.invalid && (
                            <span className="text-xs text-destructive mt-1 block">
                              {fieldState.error?.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : permission ? 'Update Permission' : 'Add Permission'}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}

export default PermissionFormDialog;