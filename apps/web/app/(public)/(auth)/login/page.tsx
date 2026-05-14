import LoginForm from '@/components/auth/LoginForm';
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
export default function LoginPage() {
  return (
    <>
      <PageTitle
        title="Đăng nhập"
        description="Đăng nhập vào tài khoản của bạn"
      />
      <div className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Chào mừng quay lại!
            </CardTitle>
            <CardDescription className="text-center">Đăng nhập</CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                href={ROUTES.REGISTER}
                className="text-primary hover:underline"
              >
                Đăng ký
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
