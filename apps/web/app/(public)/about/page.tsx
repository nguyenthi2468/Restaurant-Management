'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { restaurantInfo } from '@/data/restaurant';
import { Award, ChefHat, Heart, Sparkles, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import bannerImage from '@/images/banner.jpeg';

export default function AboutPage() {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const awardsRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const isStoryInView = useInView(storyRef, { once: true, margin: '-100px' });
  const isValuesInView = useInView(valuesRef, { once: true, margin: '-100px' });
  const isTeamInView = useInView(teamRef, { once: true, margin: '-100px' });
  const isAwardsInView = useInView(awardsRef, { once: true, margin: '-100px' });

  const highlights = [
    {
      icon: Clock,
      number: '2018',
      label: 'Năm thành lập',
      description: 'Hành trình xuất sắc trong ẩm thực',
    },
    {
      icon: Award,
      number: '5★',
      label: 'Công nhận Michelin',
      description: 'Chất lượng được công nhận quốc tế',
    },
    {
      icon: Users,
      number: '10K+',
      label: 'Khách hàng hài lòng',
      description: 'Phục vụ với tâm huyết mỗi ngày',
    },
    {
      icon: ChefHat,
      number: '50+',
      label: 'Món ăn đặc trưng',
      description: 'Được chế biến bởi đầu bếp tài năng',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Chất lượng',
      description:
        'Chúng tôi chỉ sử dụng những nguyên liệu tốt nhất, được cung ứng một cách có đạo đức từ các nhà cung cấp đáng tin cậy trên toàn thế giới. Mỗi nguyên liệu đều được chọn lọc kỹ lưỡng để đảm bảo hương vị và chất lượng tuyệt hảo.',
    },
    {
      icon: Sparkles,
      title: 'Sáng tạo',
      description:
        'Các đầu bếp của chúng tôi không ngừng đổi mới, tôn trọng truyền thống trong khi áp dụng các kỹ thuật ẩm thực hiện đại. Mỗi món ăn là một tác phẩm nghệ thuật, kết hợp hài hòa giữa cổ điển và đương đại.',
    },
    {
      icon: Users,
      title: 'Dịch vụ',
      description:
        'Sự hiếu khách đặc biệt là trung tâm của mọi điều chúng tôi làm. Đội ngũ của chúng tôi được đào tạo bài bản để mang đến trải nghiệm ẩm thực đáng nhớ cho mọi thực khách.',
    },
  ];

  const awards = [
    {
      year: '2024',
      title: 'Michelin 5 Stars',
      description: 'Công nhận xuất sắc về chất lượng ẩm thực',
    },
    {
      year: '2023',
      title: 'Best Asian Fusion Restaurant',
      description: 'Giải thưởng từ Asia Restaurant Awards',
    },
    {
      year: '2022',
      title: 'Wine Spectator Award',
      description: 'Công nhận bộ sưu tập rượu vang đẳng cấp',
    },
    {
      year: '2021',
      title: 'Best New Restaurant',
      description: 'Nhà hàng mới xuất sắc nhất năm',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="About Savore"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 drop-shadow-md">
              Về {restaurantInfo.name}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 font-light drop-shadow">
              {restaurantInfo.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-20">
            {highlights.map((highlight, idx) => {
              const IconComponent = highlight.icon;
              return (
                <motion.div
                  key={idx}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div className="text-4xl font-serif font-bold text-primary mb-2">
                    {highlight.number}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">
                    {highlight.label}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {highlight.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={storyRef}
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isStoryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-8 text-center">
              Câu chuyện của chúng tôi
            </h2>
            <div className="space-y-6 text-lg text-foreground/75 leading-relaxed">
              <p>
                {restaurantInfo.name} được thành lập vào năm{' '}
                {restaurantInfo.founded} với một tầm nhìn đơn giản nhưng đầy
                tham vọng: tạo ra một điểm đến ẩm thực nơi truyền thống Á Đông
                gặp gỡ sự đổi mới hiện đại. Chúng tôi tin rằng ẩm thực không chỉ
                là về hương vị, mà còn là về câu chuyện, văn hóa và nghệ thuật.
              </p>
              <p>
                Bếp trưởng của chúng tôi mang đến nhiều thập kỷ kinh nghiệm từ
                các nhà hàng đạt sao Michelin trên khắp châu Á và châu Âu, kết
                hợp các kỹ thuật truyền thống với sự sáng tạo đương đại. Mỗi món
                ăn là minh chứng cho cam kết của chúng tôi về sự xuất sắc và sự
                tôn trọng đối với những nguyên liệu tốt nhất.
              </p>
              <p>
                Tại {restaurantInfo.name}, chúng tôi tin rằng ăn uống là một
                trải nghiệm đánh thức mọi giác quan. Từ khoảnh khắc bạn bước vào
                không gian trang nhã của chúng tôi cho đến miếng tráng miệng thủ
                công cuối cùng, mọi chi tiết đều được cân nhắc kỹ lưỡng để tạo
                nên một hành trình ẩm thực đáng nhớ.
              </p>
              <p>
                Chúng tôi tự hào về việc sử dụng các nguyên liệu địa phương và
                bền vững, làm việc chặt chẽ với các nông dân và nhà cung cấp để
                đảm bảo chất lượng cao nhất. Triết lý của chúng tôi là tôn trọng
                nguyên liệu, tôn vinh hương vị tự nhiên của chúng thông qua kỹ
                thuật chế biến tinh tế.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={valuesRef}
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isValuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-card rounded-lg p-8 border border-border/50 hover:border-primary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isValuesInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        ref={teamRef}
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Gặp gỡ những người tài năng đằng sau trải nghiệm ẩm thực của bạn
            </p>
          </motion.div>

        </div>
      </section>

      <section
        ref={awardsRef}
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isAwardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Giải thưởng & Công nhận
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Sự công nhận cho cam kết xuất sắc của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, idx) => (
              <motion.div
                key={idx}
                className="bg-card rounded-lg p-6 border border-border/50 text-center hover:border-primary/50 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isAwardsInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="text-3xl font-serif font-bold text-primary mb-2">
                  {award.year}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {award.title}
                </h3>
                <p className="text-sm text-foreground/60">
                  {award.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              Trải nghiệm {restaurantInfo.name}
            </h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Đặt bàn ngay hôm nay và khám phá hành trình ẩm thực độc đáo của
              chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/reservation"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Đặt bàn ngay
              </motion.a>
              <motion.a
                href="/#menu"
                className="px-8 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem thực đơn
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
