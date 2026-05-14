'use client';

import { motion } from 'framer-motion';
import { restaurantInfo } from '@/data/restaurant';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    restaurant: [
      { label: 'Giới thiệu', href: '#about' },
      { label: 'Thực đơn', href: '#menu' },
      { label: 'Dịch vụ', href: '#services' },
      { label: 'Liên hệ', href: '#contact' },
    ],
    experience: [
      { label: 'Dùng bữa tại nhà hàng', href: '#services' },
      { label: 'Sự kiện riêng tư', href: '#services' },
      { label: 'Phục vụ tiệc', href: '#services' },
      { label: 'Rượu vang đi kèm', href: '#services' },
    ],
    policies: [
      { label: 'Chính sách bảo mật', href: '#' },
      { label: 'Điều khoản dịch vụ', href: '#' },
      { label: 'Chính sách đặt bàn', href: '#' },
      { label: 'Hủy bàn', href: '#' },
    ],
  };


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {/* Brand Section */}
          <motion.div variants={item} className="lg:col-span-1">
            <h2 className="text-3xl font-serif font-bold mb-4">
              {restaurantInfo.name}
            </h2>
            <p className="text-primary-foreground/80 text-sm mb-4">
              {restaurantInfo.description}
            </p>
          </motion.div>

          {/* Restaurant Links */}
          <motion.div variants={item}>
            <h4 className="font-serif font-bold text-lg mb-4">
              Nhà hàng
            </h4>
            <ul className="space-y-2">
              {footerLinks.restaurant.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Experience Links */}
          <motion.div variants={item}>
            <h4 className="font-serif font-bold text-lg mb-4">
              Trải nghiệm
            </h4>
            <ul className="space-y-2">
              {footerLinks.experience.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policies Links */}
          <motion.div variants={item}>
            <h4 className="font-serif font-bold text-lg mb-4">
              Pháp lý
            </h4>
            <ul className="space-y-2">
              {footerLinks.policies.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item}>
            <h4 className="font-serif font-bold text-lg mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="text-primary-foreground/60 text-xs mb-1">
                  Điện thoại
                </p>
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium"
                >
                  {restaurantInfo.phone}
                </a>
              </li>
              <li>
                <p className="text-primary-foreground/60 text-xs mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-primary-foreground hover:text-primary-foreground/80 transition-colors font-medium break-all"
                >
                  {restaurantInfo.email}
                </a>
              </li>
              <li>
                <p className="text-primary-foreground/60 text-xs mb-1">
                  Địa chỉ
                </p>
                <p className="text-primary-foreground/90">
                  {restaurantInfo.address}
                </p>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-primary-foreground/10 mb-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        />

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-primary-foreground/70">
            © {currentYear} {restaurantInfo.name}. Đã bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-2 text-primary-foreground/70">
            <span>Làm với</span>
            <span>cho những người yêu ẩm thực</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
