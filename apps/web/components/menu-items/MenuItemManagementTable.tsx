import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, Leaf, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MenuItem } from '@/features/menu-items';
import Link from 'next/link';
import { ROUTES } from '@/constants';

interface MenuItemTableProps {
  menuItems: MenuItem[];
  onDelete: (id: string) => void;
}

function MenuItemManagementTable({ menuItems, onDelete }: MenuItemTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
            <TableHead className="text-foreground">Món ăn</TableHead>
            <TableHead className="text-foreground">Danh mục</TableHead>
            <TableHead className="text-foreground">Giá</TableHead>
            <TableHead className="text-foreground">Đặc điểm</TableHead>
            <TableHead className="text-foreground">Trạng thái</TableHead>
            <TableHead className="text-foreground flex justify-end">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((menuItem) => (
            <TableRow
              key={menuItem.id}
              className="border-b border-border hover:bg-secondary/30 transition-colors"
            >
              <TableCell className="text-foreground font-medium">
                <div className="flex items-center gap-3">
                  {menuItem.image ? (
                    <img
                      src={menuItem.image.url}
                      alt={menuItem.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-secondary/50 rounded flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {menuItem.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{menuItem.name}</div>
                    {menuItem.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {menuItem.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {menuItem.categoryId}
              </TableCell>
              <TableCell className="text-foreground font-semibold">
                {formatPrice(menuItem.price)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {menuItem.isVegetarian && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                      <Leaf size={12} />
                      Chay
                    </span>
                  )}
                  {menuItem.isVegan && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded-full flex items-center gap-1">
                      <Leaf size={12} />
                      Vegan
                    </span>
                  )}
                  {menuItem.isSpicy && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                      <Flame size={12} />
                      Cay
                    </span>
                  )}
                  {menuItem.isGlutenFree && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                      GF
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-foreground font-medium">
                {menuItem.isAvailable ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    Có sẵn
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                    Hết hàng
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-center">
                  <Link href={`${ROUTES.ADMIN_MENU_ITEMS}/${menuItem.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 size={16} />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => onDelete(menuItem.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {menuItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Edit2 size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không tìm thấy món ăn</p>
        </div>
      )}
    </Card>
  );
}

export default MenuItemManagementTable;
