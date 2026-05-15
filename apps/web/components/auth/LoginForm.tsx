'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';

import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { Mail } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

import { loginSchema } from '@/features/auth/validator';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { API_BASE_URL, ROUTES } from '@/constants';

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      // Redirect to profile page after successful login
      router.push(ROUTES.PROFILE);
    } catch (error) {
      // Error is handled by useAuth hook
    } finally {
      setLoading(false);
    }
  };

  // Mock Google login function (would be implemented with actual OAuth)
  const googleLogin = async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <>
      {/* Using React Hook Form's Form component equivalent */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email field */}
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
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
                  htmlFor="login-form-password"
                >
                  <span>Mật khẩu</span>
                  <a
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
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

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </Button>
      </form>

      {/* Or continue with divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-gray-500">
            Hoặc đăng nhập bằng
          </span>
        </div>
      </div>

      {/* Google login button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={googleLogin}
        disabled={loading}
      >
        <GoogleIcon />
        Login with Google
      </Button>
    </>
  );
};

export default LoginForm;
