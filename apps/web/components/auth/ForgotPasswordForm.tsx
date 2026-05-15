'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/features/auth/validator';
import type * as z from 'zod';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader, Mail } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants';

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
}

export default function ForgotPasswordForm({
  onSubmit,
  loading,
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    await onSubmit(values.email);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we’ll send you instructions to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FieldGroup>       
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="forgot-password-form-email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="forgot-password-form-email"
                        type="email"
                        placeholder="Email"
                        className="pl-10"
                        disabled={loading}
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                  </div>
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive mt-1 block">
                      {fieldState.error?.message}
                    </span>
                  )}
                </Field>
              )}
            />
            </FieldGroup>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send password reset request'
              )}
            </Button>
          </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Remember password?{' '}
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}