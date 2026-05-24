import { AuthProvider } from '@/providers/AuthProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import AdminSidebar from '@/components/layouts/AdminSidebar';
import AdminHeader from '@/components/layouts/AdminHeader';
import AdminRoute from '@/components/layouts/AdminRoute';
import { PermissionProvider } from '@/providers/PermissionProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthProvider>
        <PermissionProvider>
        <AdminRoute>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <main className={cn('flex min-h-screen flex-col')}>
              <AdminHeader />
              <TooltipProvider>
              {children}
              </TooltipProvider>
            </main>
          </SidebarInset>
        </SidebarProvider>
        </AdminRoute>
        </PermissionProvider>
      </AuthProvider>
    </div>
  );
}