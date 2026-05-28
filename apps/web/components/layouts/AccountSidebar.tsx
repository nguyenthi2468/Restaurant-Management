'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Package, Menu, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    id: 'account',
    label: 'Tài khoản',
    icon: User,
    description: 'Quản lý thông tin cá nhân',
    href: '/me',
  },
  {
    id: 'myreservations',
    label: 'Đặt bàn của bạn',
    icon: Package,
    description: 'Xem và quản lý đặt bàn',
    href: '/me/my-reservations',
  },
  {
    id: 'clock',
    label: 'Chấm công',
    icon: Menu,
    description: 'Chấm công và chấm nghỉ',
    href: '/me/clock',
  },
  {
    id: 'attendance',
    label: 'Lịch sử chấm công',
    icon: Menu,
    description: 'Chấm công và chấm nghỉ',
    href: '/me/my-attendance',
  },
  {
    id: 'timeoffrequests',
    label: 'Yêu cầu nghỉ',
    icon: Star,
    description: 'Xem và quản lý yêu cầu nghỉ',
    href: '/me/my-time-off-requests',
  },

];

export function AccountSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <Card className="p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Tài khoản</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin tài khoản
        </p>
      </div>

      <nav className="mt-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.id}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start h-auto p-3 text-left',
                  isActive && 'bg-primary/10 text-primary border-primary/20'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>
    </Card>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsMobileMenuOpen(true)}
          className="w-full justify-start"
        >
          <Menu className="h-4 w-4 mr-2" />
          Tài khoản
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-80 bg-background border-r shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Tài khoản</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}