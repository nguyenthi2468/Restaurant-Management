'use client';

import { motion } from 'framer-motion';
import { restaurantInfo } from '@/data/restaurant';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const highlights = [
    {
      number: '2018',
      label: 'Năm thành lập',
      description: 'Được thành lập như một biểu tượng của sự xuất sắc trong ẩm thực',
    },
    {
      number: '5★',
      label: 'Công nhận Michelin',
      description: 'Liên tục được công nhận vì ẩm thực xuất sắc',
    },
    {
      number: '50+',
      label: 'Món ăn',
      description: 'Tuyển chọn kỹ lưỡng các món ăn đặc trưng',
    },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Về {restaurantInfo.name}
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Tôn vinh nghệ thuật ẩm thực, truyền thống và sự đổi mới
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 mb-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
              {restaurantInfo.description}
            </p>
            <p className="text-lg text-foreground/75 mb-6 leading-relaxed">
              Bếp trưởng của chúng tôi mang đến nhiều thập kỷ kinh nghiệm từ các nhà hàng đạt sao Michelin trên khắp châu Á và châu Âu, kết hợp các kỹ thuật truyền thống với sự sáng tạo đương đại. Mỗi món ăn là minh chứng cho cam kết của chúng tôi về sự xuất sắc và sự tôn trọng đối với những nguyên liệu tốt nhất.
            </p>
            <p className="text-lg text-foreground/75 leading-relaxed">
              Tại {restaurantInfo.name}, chúng tôi tin rằng ăn uống là một trải nghiệm đánh thức mọi giác quan. Từ khoảnh khắc bạn bước vào không gian trang nhã của chúng tôi cho đến miếng tráng miệng thủ công cuối cùng, mọi chi tiết đều được cân nhắc kỹ lưỡng.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          className="bg-secondary/30 rounded-lg p-8 sm:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-serif font-bold text-foreground mb-6">
            Giá trị cốt lõi
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Chất lượng',
                description:
                  'Chúng tôi chỉ sử dụng những nguyên liệu tốt nhất, được cung ứng một cách có đạo đức từ các nhà cung cấp đáng tin cậy trên toàn thế giới.',
              },
              {
                title: 'Sáng tạo',
                description:
                  'Các đầu bếp của chúng tôi không ngừng đổi mới, tôn trọng truyền thống trong khi áp dụng các kỹ thuật ẩm thực hiện đại.',
              },
              {
                title: 'Dịch vụ',
                description:
                  'Sự hiếu khách đặc biệt là trung tâm của mọi điều chúng tôi làm cho mọi thực khách.',
              },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <h4 className="text-lg font-medium text-primary mb-2">
                  {value.title}
                </h4>
                <p className="text-sm text-foreground/70">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
