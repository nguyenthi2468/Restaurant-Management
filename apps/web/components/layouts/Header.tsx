'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Thực đơn', href: '#menu' },
    { label: 'Giới thiệu', href: '#about' },
    { label: 'Dịch vụ', href: '#services' },
    { label: 'Thư viện ảnh', href: '#gallery' },
    { label: 'Liên hệ', href: '#contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <a href="#" className="text-2xl font-serif font-bold text-primary">
              Savore
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm"
                whileHover={{ color: 'var(--primary)' }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.a
            href="#contact"
            className="hidden md:block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đặt bàn
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden border-t border-border/50"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border/50">
              <a
                href="#contact"
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-md text-center font-medium"
                onClick={() => setIsOpen(false)}
              >
                Đặt bàn
              </a>
            </div>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}
