'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import placeholderImg from '@/images/placeholder.jpeg';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { formatCurrency } from '@/utils/currency';
import { useMenuItemsWithPaginationQuery } from '@/features/menu-items/queries';

export default function FeaturedMenu() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data, isLoading, isError } = useMenuItemsWithPaginationQuery({
    isFeature: true,
    limit: 5,
  });

  const items = data?.data || [];

  return (
    <section
      id="menu"
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
            Các Món Đặc Trưng
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Khám phá những sáng tạo đặc trưng của chúng tôi, được chế biến cẩn
            thận bởi các đầu bếp từng đoạt giải thưởng
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Đang tải...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-destructive">
                Không thể tải menu. Vui lòng thử lại sau.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">Không có món đặc trưng nào.</p>
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((item, idx) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      className="relative h-full"
                      whileHover={{ y: -8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <div className="bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                          <Image
                            src={item.image?.url || placeholderImg}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-4 sm:p-6 flex flex-col flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-serif font-bold text-foreground">
                              {item.name}
                            </h3>
                            {item.category?.name && (
                              <span className="ml-2 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full whitespace-nowrap">
                                {item.category.name}
                              </span>
                            )}
                          </div>

                          <p className="text-foreground/70 text-sm mb-4 flex-grow leading-relaxed">
                            {item.description || 'Món ăn đặc biệt'}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <span className="text-2xl font-serif font-bold text-primary">
                              {formatCurrency(item.price)}
                            </span>
                            <motion.a
                              href="/reservation"
                              className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Đặt bàn
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16 border-primary/50 text-primary hover:bg-primary/5" />
              <CarouselNext className="hidden md:flex -right-12 lg:-right-16 border-primary/50 text-primary hover:bg-primary/5" />
            </Carousel>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.a
            href="/menu"
            className="inline-block px-8 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Xem menu
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
