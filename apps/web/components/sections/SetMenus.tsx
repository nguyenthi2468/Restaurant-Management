'use client';

import { motion } from 'framer-motion';
import { setMenus } from '@/data/restaurant';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Check } from 'lucide-react';

export default function SetMenus() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/10">
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
            Thực đơn nếm thử & Trải nghiệm
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Bắt tay vào hành trình ẩm thực với những trải nghiệm ăn uống được tuyển chọn đặc biệt của chúng tôi
          </p>
        </motion.div>

        {/* Set Menus Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {setMenus.map((menu, idx) => (
            <motion.div
              key={menu.id}
              variants={item}
              className="relative group"
            >
              <motion.div
                className={`h-full rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  menu.popular
                    ? 'border-primary bg-card'
                    : 'border-border/50 bg-card hover:border-primary/50'
                }`}
                whileHover={{ y: -8 }}
              >
                {/* Popular Badge */}
                {menu.popular && (
                  <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 h-1"></div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    {menu.popular && (
                      <motion.div
                        className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Most Popular
                      </motion.div>
                    )}
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                      {menu.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      {menu.courses} Món • {menu.duration}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/75 text-sm mb-6 leading-relaxed">
                    {menu.description}
                  </p>

                  {/* Courses List */}
                  <div className="space-y-3 mb-8">
                    {menu.items.map((courseItem, courseIdx) => (
                      <motion.div
                        key={courseIdx}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: courseIdx * 0.1 }}
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm text-foreground/70">
                          {courseItem}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Price Section */}
                  <div className="pt-6 border-t border-border/50">
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">
                          Mỗi người
                        </p>
                        <div className="text-3xl font-serif font-bold text-primary">
                          ${menu.price}
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.a
                      href="#contact"
                      className={`block w-full text-center py-3 rounded-md font-medium transition-colors ${
                        menu.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'border-2 border-primary text-primary hover:bg-primary/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reserve Experience
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 bg-card rounded-lg p-8 border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
            Customization Available
          </h3>
          <p className="text-foreground/70 mb-4">
            All menus can be customized to accommodate dietary restrictions, allergies, and preferences.
            Our team will work with you to create a personalized dining experience.
          </p>
          <motion.a
            href="#contact"
            className="text-primary font-medium hover:text-primary/80 inline-flex items-center gap-2"
            whileHover={{ x: 4 }}
          >
            Contact us for customization
            <span className="text-lg">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
