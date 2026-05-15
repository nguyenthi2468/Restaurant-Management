'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User } from '@/features/user';
import { userFormSchema, UserFormValues } from '@/features/user';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface UserEditFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: UserFormValues) => Promise<void>;
}
function UserEditFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserEditFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
      });
    }
  }, [user, form]);
  const handleSubmit = async (data: UserFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Form submission error:', error);
    }
  };
  const dialogTitle = user ? 'Edit User' : 'Add New User';
  const dialogDescription = user
    ? 'Make changes to the user information here.'
    : 'Add a new user to the system.';
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
              {/* First Name */}
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FieldLabel className="text-right">First Name</FieldLabel>
                        <div className="col-span-3">
                          <Input {...field} placeholder="Enter first name" aria-invalid={fieldState.invalid} />
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

              {/* Last Name */}
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FieldLabel className="text-right">Last Name</FieldLabel>
                        <div className="col-span-3">
                          <Input {...field} placeholder="Enter last name" aria-invalid={fieldState.invalid} />
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
                {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}

export default UserEditFormDialog;