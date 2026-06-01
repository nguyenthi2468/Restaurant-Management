import { AccountSidebar } from '@/components/layouts/AccountSidebar';
import { PageTitle } from '@/components/common/PageTitle';
import React from 'react';
import { PermissionProvider } from '@/providers/PermissionProvider';

export default function TaiKhoanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle
        title="Tài khoản"
        description="Quản lý thông tin cá nhân và cài đặt tài khoản"
      />
      <PermissionProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <AccountSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </PermissionProvider>
    </div>
  );
}
