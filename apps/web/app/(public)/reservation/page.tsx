'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, Calendar, Users, MessageSquare, UtensilsCrossed, ConciergeBell, CreditCard, Info } from 'lucide-react';
import Link from 'next/link';

import { restaurantInfo, setMenus, services } from '@/data/restaurant';

import { formatCurrency } from '@/utils/currency';
import { PageTitle } from '@/components/common/PageTitle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ReservationPage() {
  const [guests, setGuests] = useState<number>(0);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  const servicePrice = services.find(s => s.id === selectedService)?.price || 0;
  const menuPrice = setMenus.find(m => m.id === selectedMenu)?.price || 0;
  
  const totalPrice = servicePrice + (menuPrice * guests);
  const isFree = totalPrice === 0;
  const depositAmount = isFree ? 20000 : totalPrice * 0.5;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Page Header */}
     <PageTitle
          title="Đặt bàn"
          description={`Trải nghiệm không gian ẩm thực tinh tế và dịch vụ đẳng cấp tại ${restaurantInfo.name}`}
        />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Reservation Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-card rounded-2xl p-6 sm:p-10 border border-border/50 shadow-sm relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>

              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                Thông tin đặt bàn
              </h2>
              <p className="text-foreground/60 mb-8">
                Vui lòng điền thông tin bên dưới để chúng tôi chuẩn bị tốt nhất cho bạn.
              </p>

              <Alert className="mb-8 bg-primary/5 border-primary/20">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle className="text-foreground">Theo dõi đơn đặt bàn?</AlertTitle>
                <AlertDescription className="text-foreground/80">
                  Vui lòng <Link href="/login" className="font-semibold text-primary hover:underline transition-all">đăng nhập</Link> trước khi đặt bàn để có thể dễ dàng quản lý và theo dõi trạng thái đơn hàng của bạn.
                </AlertDescription>
              </Alert>
              
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Họ và tên <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên của bạn"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Số điện thoại <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Ngày đến <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Giờ đến <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      required
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Số lượng khách <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Chọn số lượng khách</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "10+"].map((num) => (
                          <option key={num} value={num}>
                            {num} Khách
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <ConciergeBell className="w-4 h-4 text-primary" />
                      Dịch vụ <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                        required
                        defaultValue=""
                      >
                        <option value="" disabled>Chọn dịch vụ</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} {service.price > 0 ? `- $${service.price}` : '(Miễn phí)'}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Set Menu */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-primary" />
                      Set Menu (Tùy chọn)
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                        value={selectedMenu}
                        onChange={(e) => setSelectedMenu(e.target.value)}
                      >
                        <option value="">Không chọn Set Menu</option>
                        {setMenus.map((menu) => (
                          <option key={menu.id} value={menu.id}>
                            {menu.name} - ${menu.price}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Yêu cầu đặc biệt
                    </label>
                    <textarea
                      placeholder="Dị ứng thực phẩm, kỷ niệm, vị trí ngồi..."
                      rows={4}
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>
                  
                  {/* Deposit Info */}
                  <div className="md:col-span-2 p-6 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-lg">
                          {isFree ? 'Tiền cọc giữ bàn' : 'Tiền thanh toán trước (50%)'}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {isFree ? 'Sẽ được hoàn lại hoặc trừ vào hóa đơn khi dùng bữa' : 'Thanh toán trước để xác nhận dịch vụ và thực đơn'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-3xl font-bold text-primary">{formatCurrency(depositAmount)}</p>
                      {!isFree && <p className="text-sm text-foreground/50 mt-1">Tổng tiền đặt trước: {formatCurrency(totalPrice)}</p>}
                    </div>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Xác nhận đặt bàn
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
                <p className="text-sm text-foreground/50 text-center mt-4">
                  Chúng tôi sẽ liên hệ lại để xác nhận trong vòng 30 phút.
                </p>
              </form>
            </div>
          </motion.div>

          {/* Contact Information & Policies */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Info Card */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              
              <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Liên hệ trực tiếp</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Địa chỉ</p>
                    <p className="text-primary-foreground/80 text-sm leading-relaxed">{restaurantInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Hotline</p>
                    <a href={`tel:${restaurantInfo.phone}`} className="text-primary-foreground/80 text-sm hover:text-primary-foreground transition-colors block">
                      {restaurantInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <a href={`mailto:${restaurantInfo.email}`} className="text-primary-foreground/80 text-sm hover:text-primary-foreground transition-colors block">
                      {restaurantInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:border-primary/20 transition-colors">
              <h3 className="text-xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                Giờ mở cửa
              </h3>
              <div className="space-y-4">
                {restaurantInfo.hours.map((hour, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <span className="font-medium text-foreground/80">{hour.day}</span>
                    <span className="text-foreground/60">{hour.open}{hour.close && ` - ${hour.close}`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies Card */}
            <div className="bg-secondary/30 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Lưu ý đặt bàn
              </h3>
              <ul className="space-y-3 text-sm text-foreground/70 list-disc list-inside">
                <li>Bàn sẽ được giữ tối đa 15 phút.</li>
                <li>Nhóm từ 10 người trở lên vui lòng gọi hotline.</li>
                <li>Dress code: Lịch sự, trang nhã.</li>
                <li>Không mang theo thú cưng.</li>
              </ul>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
