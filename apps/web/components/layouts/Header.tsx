'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/AuthProvider';
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
 const { user, logout } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Thực đơn', href: '/menu' },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Tin tức', href: '/news' },
    { label: 'Xác nhận đặt bàn', href: '/verify-booking' },
    { label: 'Liên hệ', href: '/contact' },
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
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
              Savore
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href={ROUTES.RESERVATION}
              className="hidden md:block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
            >
              Đặt bàn
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.avatar?.url} />
                    <AvatarFallback>
                      <div className="bg-primary text-white w-full h-full flex justify-center items-center">
                        {user.firstName?.charAt(0) || '?'}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName || '?'} {user.lastName || '?'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/me">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/me/my-reservations">My Reservations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button
                      className="cursor-pointer w-full h-full text-start"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href={ROUTES.LOGIN}
                className="hidden md:flex p-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
                title="Đăng nhập"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
          </div>
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
              <Link
                key={idx}
                href={item.href}
                className="block text-foreground/80 hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
              <Link
                href={ROUTES.RESERVATION}
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-md text-center font-medium"
                onClick={() => setIsOpen(false)}
              >
                Đặt bàn
              </Link>
              {user ? (
                <>
                  <Link
                    href="/me"
                    className="block px-4 py-2 border border-primary text-primary rounded-md text-center font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Tài khoản
                  </Link>
                  <button
                    className="block w-full px-4 py-2 border border-destructive text-destructive rounded-md text-center font-medium"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  href={ROUTES.LOGIN}
                  className="flex justify-center items-center px-4 py-2 border border-primary text-primary rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}
