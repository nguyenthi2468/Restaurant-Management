'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { X } from 'lucide-react';

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      id: 'img-1',
      title: 'Phòng ăn thanh lịch',
      category: 'ambiance',
      icon: '🏨',
    },
    {
      id: 'img-2',
      title: 'Món ăn trình bày nghệ thuật',
      category: 'cuisine',
      icon: '🍽️',
    },
    {
      id: 'img-3',
      title: 'Bếp của bếp trưởng',
      category: 'kitchen',
      icon: '👨‍🍳',
    },
    {
      id: 'img-4',
      title: 'Quầy bar cao cấp',
      category: 'ambiance',
      icon: '🍷',
    },
    {
      id: 'img-5',
      title: 'Món ăn đặc trưng',
      category: 'cuisine',
      icon: '✨',
    },
    {
      id: 'img-6',
      title: 'Phòng ăn riêng tư',
      category: 'ambiance',
      icon: '💎',
    },
  ];

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
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <section
      id="gallery"
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
            Thư viện ảnh
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Khám phá không gian và nghệ thuật ẩm thực tạo nên Savoré
          </p>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {images.map((image, idx) => (
            <motion.button
              key={image.id}
              variants={item}
              onClick={() => setSelectedImage(image.id)}
              className="relative group overflow-hidden rounded-lg aspect-square"
            >
              <div className="relative h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {/* Pattern Background */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05))] bg-[length:30px_30px]"></div>

                {/* Content */}
                <motion.div
                  className="relative z-10 text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="text-6xl mb-3">{image.icon}</div>
                  <h3 className="text-lg font-serif font-bold text-foreground">
                    {image.title}
                  </h3>
                </motion.div>

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300"
                />

                {/* Border */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-lg transition-colors duration-300"></div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Container */}
              <div className="bg-card rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-8xl">
                    {images.find((img) => img.id === selectedImage)?.icon}
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-6 bg-card">
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                    {images.find((img) => img.id === selectedImage)?.title}
                  </h3>
                  <p className="text-foreground/70">
                    Trải nghiệm sự thanh lịch và chú ý đến từng chi tiết làm cho Savoré trở nên độc đáo.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                className="absolute -top-12 -right-12 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.a
            href="#contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đặt bàn ngay
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
