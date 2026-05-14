'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import {
  UtensilsCrossed,
  Users,
  Utensils,
  Wine,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      id: 'svc-1',
      name: 'Ẩm thực cao cấp',
      description:
        'Trải nghiệm phòng ăn thanh lịch của chúng tôi với dịch vụ hoàn hảo và không gian tinh tế',
      icon: UtensilsCrossed,
    },
    {
      id: 'svc-2',
      name: 'Sự kiện riêng tư',
      description:
        'Tổ chức dịp đặc biệt của bạn trong phòng ăn riêng tư ấm cúng của chúng tôi với thực đơn theo yêu cầu',
      icon: Users,
    },
    {
      id: 'svc-3',
      name: 'Dịch vụ tiệc',
      description:
        'Mang sự xuất sắc về ẩm thực của Savoré đến địa điểm của bạn với dịch vụ tiệc chuyên nghiệp',
      icon: Utensils,
    },
    {
      id: 'svc-4',
      name: 'Rượu vang đi kèm',
      description:
        'Chuyên gia rượu vang của chúng tôi tuyển chọn những loại rượu vang hoàn hảo để kết hợp với từng món ăn',
      icon: Wine,
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Vị trí đắc địa',
      description: '456 Phố Ẩm Thực, San Francisco',
    },
    {
      icon: Clock,
      title: 'Giờ mở cửa kéo dài',
      description: 'Mở cửa từ Thứ Ba đến Chủ Nhật để thuận tiện cho bạn',
    },
    {
      icon: Phone,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ phục vụ tận tâm cho mọi nhu cầu của bạn',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="services"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
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
            Dịch vụ của chúng tôi
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Khám phá nhiều cách khác nhau mà chúng tôi có thể phục vụ bạn
          </p>
        </motion.div>

        {/* Main Services Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={item}
                className="group"
              >
                <motion.div
                  className="bg-card rounded-lg p-6 border border-border/50 hover:border-primary/50 transition-colors h-full flex flex-col"
                  whileHover={{ y: -8, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                >
                  {/* Icon */}
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors"
                    whileHover={{ rotate: 360 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <IconComponent className="w-6 h-6 text-primary" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    {service.name}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  {/* Link */}
                  <motion.a
                    href="#contact"
                    className="mt-4 text-primary text-sm font-medium inline-flex items-center gap-2 group/link"
                    whileHover={{ x: 4 }}
                  >
                    Tìm hiểu thêm
                    <span className="group-hover/link:translate-x-1 transition-transform">
                      →
                    </span>
                  </motion.a>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={idx}
                className="bg-secondary/30 rounded-lg p-6 border border-border/50 flex items-start gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-foreground/60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Special Offerings */}
        <motion.div
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-8 sm:p-12 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Đặt bàn nhóm & Sự kiện doanh nghiệp
              </h3>
              <p className="text-foreground/75 mb-6 leading-relaxed">
                Chúng tôi chuyên tổ chức trải nghiệm ăn uống theo nhóm và sự kiện doanh nghiệp. Cho dù bạn đang lên kế hoạch tổ chức tiệc chúc mừng của nhóm, bữa tối cho khách hàng hay một buổi họp mặt quan trọng, đội ngũ tận tâm của chúng tôi sẽ tạo ra một trải nghiệm khó quên được thiết kế riêng theo mong muốn của bạn.
              </p>
              <motion.a
                href="#contact"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hỏi về đặt nhóm
              </motion.a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Thực đơn tùy chỉnh',
                'Dịch vụ tận tâm',
                'Bố trí linh hoạt',
                'Rượu vang đi kèm',
              ].map((offering, idx) => (
                <motion.div
                  key={idx}
                  className="bg-card rounded-lg p-4 border border-border/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <p className="font-medium text-foreground text-sm">✓ {offering}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
