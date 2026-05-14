'use client';

import { motion } from 'framer-motion';
import { restaurantInfo } from '@/data/restaurant';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Địa điểm',
      value: restaurantInfo.address,
      href: '#',
    },
    {
      icon: Phone,
      label: 'Điện thoại',
      value: restaurantInfo.phone,
      href: `tel:${restaurantInfo.phone}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: restaurantInfo.email,
      href: `mailto:${restaurantInfo.email}`,
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Bạn đã sẵn sàng trải nghiệm Savoré? Hãy liên hệ với chúng tôi để đặt bàn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Contact Cards */}
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, idx) => {
                const IconComponent = info.icon;
                return (
                  <motion.a
                    key={idx}
                    href={info.href}
                    className="flex items-start gap-4 p-6 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-colors group"
                    whileHover={{ x: 8 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground/60 mb-1">
                        {info.label}
                      </h3>
                      <p className="text-lg font-serif font-bold text-foreground">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Hours */}
            <motion.div
              className="bg-card rounded-lg p-8 border border-border/50"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Giờ hoạt động
                </h3>
              </div>

              <div className="space-y-3">
                {restaurantInfo.hours.map((hour, idx) => (
                  <motion.div
                    key={idx}
                    className="flex justify-between items-center pb-3 border-b border-border/50 last:border-b-0 last:pb-0"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span className="font-medium text-foreground">
                      {hour.day}
                    </span>
                    <span className="text-foreground/70">
                      {hour.open}
                      {hour.close && ` - ${hour.close}`}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <form className="bg-card rounded-lg p-8 border border-border/50">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
                Đặt bàn
              </h3>

              <div className="space-y-6">
                {/* Name */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Địa chỉ email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </motion.div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ngày
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Giờ
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  </motion.div>
                </div>

                {/* Guests */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số lượng khách
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} Khách
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    placeholder="Có chế độ ăn kiêng, dị ứng hoặc dịp đặc biệt nào không?"
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Đặt bàn ngay
                </motion.button>

                <p className="text-xs text-foreground/50 text-center">
                  Chúng tôi sẽ xác nhận đặt bàn của bạn trong vòng 24 giờ.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
