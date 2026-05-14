'use client';
import Image from 'next/image';
import bannerImage from '@/images/banner.jpeg';
import { motion } from 'framer-motion';
export const PageTitle = ({
    title,
    description
}: {
    title: string;
    description: string;
}) => {
    return (
          <div className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={bannerImage}
            alt="Đặt bàn tại Savore"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {description}
          </motion.p>
        </div>
      </div>
    );
};