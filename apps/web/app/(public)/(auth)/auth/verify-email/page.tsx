'use client';
import VerifyEmail from '@/components/auth/VerifyEmail';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Suspense } from 'react';
import { ROUTES } from '@/constants';
import { PageTitle } from '@/components/common/PageTitle';

export default function ConfirmAccount() {
  return (
    <>
      <PageTitle
        title="Verify Email"
        description="Verify your account to start using our services."
      />
      <div className="py-20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Verify Account
            </CardTitle>
            <CardDescription className="text-center">
              Verify your account to start using our services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <VerifyEmail />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}