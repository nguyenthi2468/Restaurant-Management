import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MenuCategory } from '@/features/menu-categories';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import Image from 'next/image';
interface MenuCategoryTableProps {
  menuCategories: MenuCategory[];
  onDelete: (id: string) => void;
}
function MenuCategoryManagementTable({ menuCategories, onDelete }: MenuCategoryTableProps) {
  return (
          <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-foreground">Category Name</TableHead>
              <TableHead className="text-foreground">Description</TableHead>
              <TableHead className="text-foreground">Position</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground flex justify-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuCategories.map((menuCategory) => (
              <TableRow key={menuCategory.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-2">
                    {menuCategory.image ? (
                      <Image 
                        src={menuCategory.image.secureUrl} 
                        alt={menuCategory.name}
                        width={200}
                        height={200}
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-6 w-6 bg-secondary/50 rounded flex items-center justify-center">
                        <span className="text-xs">{menuCategory.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <span className="ml-2">{menuCategory.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{menuCategory.description}</TableCell>
                <TableCell className="text-foreground font-medium">{menuCategory.position}</TableCell>
                <TableCell className="text-foreground font-medium">
                  {menuCategory.isActive ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Inactive</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <Link href={`${ROUTES.ADMIN_MENU_CATEGORIES}/${menuCategory.id}`}>
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
                      onClick={() => onDelete(menuCategory.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {menuCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Edit2 size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No menu categories found</p>
          </div>
        )}
      </Card>
  )
}

export default MenuCategoryManagementTable