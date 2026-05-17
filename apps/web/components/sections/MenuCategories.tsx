'use client';

import { motion } from 'framer-motion';
import { menuItems } from '@/data/restaurant';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { formatCurrency } from '@/utils/currency';

export default function MenuCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'appetizers', name: 'Món khai vị', color: 'from-blue-500/20' },
    { id: 'mains', name: 'Món chính', color: 'from-amber-500/20' },
    { id: 'desserts', name: 'Tráng miệng', color: 'from-rose-500/20' },
    { id: 'beverages', name: 'Đồ uống', color: 'from-purple-500/20' },
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="menu-categories" className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background">
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
            Toàn bộ thực đơn
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Khám phá đầy đủ các món ăn được tuyển chọn cẩn thận của chúng tôi
          </p>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {categories.map((cat, idx) => {
            const items = menuItems.filter((item) => item.category === cat.id);
            return (
              <motion.button
                key={cat.id}
                variants={item}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className="relative group"
              >
                <div
                  className={`relative h-40 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedCategory === cat.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} to-transparent`}></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-card/80 via-card/40 to-transparent group-hover:from-card group-hover:via-card/60 transition-all duration-300">
                    <h3 className="text-lg font-serif font-bold text-foreground text-center">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-2">
                      {items.length} món
                    </p>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-lg transition-colors duration-300"></div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Menu Items Grid */}
        {selectedCategory && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-serif font-bold text-foreground mb-8">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter((item) => item.category === selectedCategory)
                .map((menuItem, idx) => (
                  <motion.div
                    key={menuItem.id}
                    className="bg-card rounded-lg p-6 border border-border/50 hover:border-primary/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-foreground">
                          {menuItem.name}
                        </h4>
                        <div className="flex gap-2 mt-2">
                          {menuItem.vegetarian && (
                            <span className="px-2 py-1 bg-green-100/30 text-green-700 text-xs rounded font-medium">
                              Ăn chay
                            </span>
                          )}
                          {menuItem.vegan && (
                            <span className="px-2 py-1 bg-green-100/50 text-green-800 text-xs rounded font-medium">
                              Thuần chay
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xl font-serif font-bold text-primary ml-4 flex-shrink-0">
                        {formatCurrency(menuItem.price)}
                      </span>
                    </div>

                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {menuItem.description}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* All Categories View */}
        {!selectedCategory && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
                  {cat.name}
                </h3>
                <div className="space-y-4">
                  {menuItems
                    .filter((item) => item.category === cat.id)
                    .slice(0, 3)
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        className="pb-4 border-b border-border/30"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-serif font-bold text-foreground">
                            {item.name}
                          </h4>
                          <span className="text-primary font-bold ml-4 flex-shrink-0">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/70">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTA Button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.a
            href="#contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đặt bàn
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
