'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { Mail, User } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { registerSchema } from '@/features/auth/validator';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { API_BASE_URL, ROUTES } from '@/constants';

const RegisterForm = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      await register(data);
      // Redirect to login page after successful registration
      router.push(ROUTES.LOGIN);
    } catch (error) {
      // Error is handled by useAuth hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Using React Hook Form's Form component equivalent */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* First name field */}
        <FieldGroup>
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-firstName">Họ</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập họ"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive mt-1 block">
                      {fieldState.error?.message}
                    </span>
                  )}
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        {/* Last name field */}
        <FieldGroup>
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-lastName">Tên</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập tên"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive mt-1 block">
                      {fieldState.error?.message}
                    </span>
                  )}
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        {/* Email field */}
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nhập email"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <span className="text-xs text-destructive mt-1 block">
                      {fieldState.error?.message}
                    </span>
                  )}
                </div>
              </Field>
            )}
          />
        </FieldGroup>

        {/* Password field */}
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="flex items-center justify-between"
                  htmlFor="register-form-password"
                >
                  <span>Mật khẩu</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="sr-only">
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
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

        {/* Confirm password field */}
        <FieldGroup>
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  className="flex items-center justify-between"
                  htmlFor="register-form-confirmPassword"
                >
                  <span>Xác nhận mật khẩu</span>
                </FieldLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu"
                    className="pl-10"
                    disabled={loading}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Đang đăng ký...
            </>
          ) : (
            'Đăng ký'
          )}
        </Button>
      </form>

      {/* Or continue with divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-gray-500">Hoặc đăng ký bằng</span>
        </div>
      </div>

      {/* Google register button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          window.location.href = `${API_BASE_URL}/auth/google`;
        }}
        disabled={loading}
      >
        <Mail className="mr-2 h-4 w-4" />
        Đăng ký với Google
      </Button>
    </>
  );
};

export default RegisterForm;
