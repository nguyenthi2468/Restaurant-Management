'use client';

import {
  Armchair,
  Bookmark,
  ChefHat,
  FileText,
  Receipt,
  CreditCard,
  Utensils,
  Calendar,
  Clock,
  Contact,
  Newspaper,
  BotMessageSquare,
} from 'lucide-react';
import { ChevronDown, Home, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants';
import { usePermission } from '@/providers/PermissionProvider';
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: SubMenuItem[];
  action: string;
}
interface SubMenuItem {
  title: string;
  href: string;
  action: string;
}
export const navItems: NavItem[] = [
  {
    title: 'AI',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: BotMessageSquare,
    action: 'ai.read',
  },
  {
    title: 'Danh mục món ăn',
    href: ROUTES.ADMIN_MENU_CATEGORIES,
    icon: Bookmark,
    action: 'menu_categories.read',
  },
  {
    title: 'Món ăn',
    href: ROUTES.ADMIN_MENU_ITEMS,
    icon: ChefHat,
    action: 'menu_items.read',
  },
  {
    title: 'Bàn',
    href: ROUTES.ADMIN_TABLES,
    icon: Armchair,
    action: 'tables.read',
    submenu: [
      { title: 'Sàn', href: ROUTES.ADMIN_FLOORS, action: 'tables.read' },
      { title: 'Bàn', href: ROUTES.ADMIN_TABLES, action: 'tables.read' },
    ],
  },
  {
    title: 'Thu ngân',
    href: ROUTES.ADMIN_CASHIER,
    icon: CreditCard,
    action: 'cashier.read',
  },
  {
    title: 'Bếp',
    href: ROUTES.ADMIN_KITCHEN,
    icon: Utensils,
    action: 'kitchen.read',
  },
  {
    title: 'Đặt bàn',
    href: ROUTES.ADMIN_RESERVATIONS,
    icon: Calendar,
    action: 'reservation.read',
  },
  {
    title: 'Đơn hàng',
    href: ROUTES.ADMIN_ORDERS,
    icon: Receipt,
    action: 'order.read',
  },
  {
    title: 'Lịch làm việc',
    href: ROUTES.ADMIN_EMPLOYEE_SCHEDULES,
    icon: Clock,
    action: 'employee-schedule:read',
    submenu: [
      {
        title: 'Ca làm',
        href: ROUTES.ADMIN_SHIFTS,
        action: 'employee-schedule:read',
      },
      {
        title: 'Lịch làm việc',
        href: ROUTES.ADMIN_EMPLOYEE_SCHEDULES,
        action: 'employee-schedule:read',
      },
      {
        title: 'Chấm công',
        href: ROUTES.ADMIN_ATTENDANCE,
        action: 'employee-schedule:read',
      },
      {
        title: 'Yêu cầu nghỉ phép',
        href: ROUTES.ADMIN_TIME_OFF_REQUESTS,
        action: 'employee-schedule:read',
      },
    ],
  },
  {
    title: 'Liên hệ',
    href: ROUTES.ADMIN_CONTACTS,
    icon: Contact,
    action: 'contacts.read',
  },
  {
    title: 'Tin tức',
    href: ROUTES.ADMIN_NEWS,
    icon: Newspaper,
    action: 'news.read',
  },
  {
    title: 'Người dùng',
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    action: 'users.list',
    submenu: [
      { title: 'Người dùng', href: ROUTES.ADMIN_USERS, action: 'users.list' },
      { title: 'Vai trò', href: ROUTES.ADMIN_ROLES, action: 'roles.list' },
      {
        title: 'Quyền hạn',
        href: ROUTES.ADMIN_PERMISSIONS,
        action: 'permissions.list',
      },
      {
        title: 'Hành động',
        href: ROUTES.ADMIN_ACTIONS,
        action: 'actions.list',
      },
    ],
  },
];
export default function AdminSidebar() {
  const pathname = usePathname();
  const { can } = usePermission();

  function filterMenu(
    menu: NavItem[],
    can: (action: string) => boolean,
  ): NavItem[] {
    return menu
      .filter((item) => !item.action || can(item.action))
      .map((item) => ({
        ...item,
        submenu: item.submenu
          ? item.submenu.filter(
              (subItem) => !subItem.action || can(subItem.action),
            )
          : undefined,
      }));
  }

  const filteredMenu = filterMenu(navItems, can);
  // const filteredMenu = navItems;
  return (
    <Sidebar collapsible="icon" className="h-screen">
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1 className="text-2xl text-black font-bold">
              Bảng điều khiển quản trị
            </h1>
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenu.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/');

                if (item.submenu) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={pathname?.startsWith(item.href)}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={isActive}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.href}
                                >
                                  <Link href={subItem.href}>
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/profile'}
            >
              <Link href="/dashboard/profile">
                <CircleUser className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/settings'}
            >
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  );
}
