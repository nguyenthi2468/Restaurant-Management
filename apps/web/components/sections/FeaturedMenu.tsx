'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import placeholderImg from '@/images/placeholder.jpeg';
import { menuItems } from '@/data/restaurant';
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

export default function FeaturedMenu() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Select featured items (mains and special appetizers)
  const featuredItems = menuItems.filter(
    (item) =>
      (item.category === 'mains' && Math.random() > 0.4) ||
      (item.category === 'appetizers' && item.price > 10)
  );

  const items = [
    {
      id: 'feat-1',
      name: 'Miso-Glazed Cod',
      description: 'Pan-seared Atlantic cod with white miso butter, accompanied by jasmine rice and seasonal vegetables',
      price: 420000,
      image: '/images/placeholder-1.jpg',
      tag: 'Chef\'s Selection',
    },
    {
      id: 'feat-2',
      name: 'Wagyu Beef Perfection',
      description: 'Premium Japanese A5 Wagyu with five-spice rub and truffle mashed potatoes',
      price: 580000,
      image: '/images/placeholder-2.jpg',
      tag: 'Premium',
    },
    {
      id: 'feat-3',
      name: 'Peking Duck',
      description: 'Traditionally roasted duck with crispy skin, thin pancakes, and hoisin sauce',
      price: 520000,
      image: '/images/placeholder-3.jpg',
      tag: 'House Specialty',
    },
    {
      id: 'feat-4',
      name: 'Yuzu Panna Cotta',
      description: 'Silky panna cotta with yuzu citrus sauce and edible flowers',
      price: 110000,
      image: '/images/placeholder-4.jpg',
      tag: 'Dessert',
    },
  ];

  return (
    <section id="menu" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/10">
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
            Khám phá những sáng tạo đặc trưng của chúng tôi, được chế biến cẩn thận bởi các đầu bếp từng đoạt giải thưởng
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {items.map((item, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    className="relative h-full"
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <div className="bg-card rounded-lg overflow-hidden border border-border/50 hover:border-primary/50 transition-colors h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                      {/* Image Placeholder */}
                      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                        <Image
                          src={placeholderImg}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-serif font-bold text-foreground">
                            {item.name}
                          </h3>
                          <span className="ml-2 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full whitespace-nowrap">
                            {item.tag}
                          </span>
                        </div>

                        <p className="text-foreground/70 text-sm mb-4 flex-grow leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <span className="text-2xl font-serif font-bold text-primary">
                            {formatCurrency(item.price)}
                          </span>
                          <motion.a
                            href="#contact"
                            className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded hover:bg-primary/5 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Reserve
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
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.a
            href="#menu-categories"
            className="inline-block px-8 py-3 border-2 border-primary text-primary rounded-md font-medium hover:bg-primary/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Full Menu
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
