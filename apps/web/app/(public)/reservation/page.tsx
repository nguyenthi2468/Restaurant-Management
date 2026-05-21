import { ReservationForm } from '@/components/reservation/ReservationForm';
import { Calendar, Clock, Users } from 'lucide-react';

export const metadata = {
  title: 'Đặt bàn - Restaurant Management',
  description: 'Đặt bàn trực tuyến tại nhà hàng của chúng tôi',
};

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Đặt bàn trực tuyến
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Đặt bàn ngay hôm nay để trải nghiệm ẩm thực tuyệt vời tại nhà hàng
            của chúng tôi. Chúng tôi cam kết mang đến cho bạn dịch vụ tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Đặt bàn dễ dàng
            </h3>
            <p className="text-sm text-slate-600">
              Chọn ngày giờ phù hợp với lịch trình của bạn
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Xác nhận nhanh chóng
            </h3>
            <p className="text-sm text-slate-600">
              Nhận xác nhận đặt bàn ngay lập tức
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Phù hợp mọi nhóm
            </h3>
            <p className="text-sm text-slate-600">
              Từ bữa ăn riêng tư đến tiệc lớn
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Thông tin đặt bàn
          </h2>
          <ReservationForm />
        </div>

        <div className="mt-8 text-center text-sm text-slate-600">
          <p>
            Bạn cần hỗ trợ? Liên hệ với chúng tôi qua số điện thoại{' '}
            <a href="tel:0123456789" className="text-blue-600 hover:underline">
              0123 456 789
            </a>{' '}
            hoặc email{' '}
            <a
              href="mailto:info@restaurant.com"
              className="text-blue-600 hover:underline"
            >
              info@restaurant.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
