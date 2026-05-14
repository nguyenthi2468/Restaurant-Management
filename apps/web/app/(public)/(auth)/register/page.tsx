import RegisterForm from '@/components/auth/RegisterForm';
import { PageTitle } from '@/components/common/PageTitle';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/constants';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <>
      <PageTitle
        title="Đăng ký"
        description="Đăng ký tài khoản mới"
      />
      <div className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Tạo tài khoản mới
            </CardTitle>
            <CardDescription className="text-center">Đăng ký</CardDescription>
          </CardHeader>

          <CardContent>
            <RegisterForm />
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                href={ROUTES.LOGIN}
                className="text-primary hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}