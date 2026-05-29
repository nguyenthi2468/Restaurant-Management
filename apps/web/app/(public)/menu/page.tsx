'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Leaf, Wheat, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { useMenuItemsWithPaginationQuery } from '@/features/menu-items/queries';
import { useMenuCategoriesQuery } from '@/features/menu-categories/queries';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/common/PageTitle';

const ITEMS_PER_PAGE = 12;

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dietaryFilter, setDietaryFilter] = useState<{
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
  }>({});

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useMenuCategoriesQuery();

  const { data: menuData, isLoading: menuLoading } =
    useMenuItemsWithPaginationQuery({
      menuCategoryId: selectedCategory || undefined,
      search: debouncedSearch || undefined,
      isAvailable: true,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    });

  const categories = categoriesData?.filter((cat) => cat.isActive) || [];
  const menuItems = menuData?.data || [];
  const totalPages = menuData?.meta?.totalPages || 1;

  const filteredMenuItems = menuItems.filter((item) => {
    if (dietaryFilter.isVegetarian && !item.isVegetarian) return false;
    if (dietaryFilter.isVegan && !item.isVegan) return false;
    if (dietaryFilter.isGlutenFree && !item.isGlutenFree) return false;
    if (dietaryFilter.isSpicy && !item.isSpicy) return false;
    return true;
  });

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDietaryFilter = (filter: keyof typeof dietaryFilter) => {
    setDietaryFilter((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
        <PageTitle title='Thực đơn' description=' Khám phá các món ăn đặc sắc của chúng tôi'/>
      <div className="container mx-auto px-4 py-8">

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('')}
              disabled={categoriesLoading}
            >
              Tất cả
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? 'default' : 'outline'
                }
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={dietaryFilter.isVegetarian ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleDietaryFilter('isVegetarian')}
            >
              <Leaf className="h-4 w-4 mr-1" />
              Chay
            </Button>
            <Button
              variant={dietaryFilter.isVegan ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleDietaryFilter('isVegan')}
            >
              <Leaf className="h-4 w-4 mr-1" />
              Thuần chay
            </Button>
            <Button
              variant={dietaryFilter.isGlutenFree ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleDietaryFilter('isGlutenFree')}
            >
              <Wheat className="h-4 w-4 mr-1" />
              Không gluten
            </Button>
            <Button
              variant={dietaryFilter.isSpicy ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleDietaryFilter('isSpicy')}
            >
              <Flame className="h-4 w-4 mr-1" />
              Cay
            </Button>
          </div>
        </div>

        {menuLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-5 bg-muted rounded animate-pulse w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Không tìm thấy món ăn nào
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenuItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square">
                    {item.image?.url ? (
                      <Image
                        src={item.image.url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">
                          Không có ảnh
                        </span>
                      </div>
                    )}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Hết món</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.isVegetarian && (
                        <Badge variant="secondary" className="text-xs">
                          <Leaf className="h-3 w-3 mr-1" />
                          Chay
                        </Badge>
                      )}
                      {item.isVegan && (
                        <Badge variant="secondary" className="text-xs">
                          <Leaf className="h-3 w-3 mr-1" />
                          Thuần chay
                        </Badge>
                      )}
                      {item.isGlutenFree && (
                        <Badge variant="secondary" className="text-xs">
                          <Wheat className="h-3 w-3 mr-1" />
                          Không gluten
                        </Badge>
                      )}
                      {item.isSpicy && (
                        <Badge variant="secondary" className="text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          Cay
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(item.price)}
                      </span>
                      {item.preparationTime && (
                        <span className="text-xs text-muted-foreground">
                          ~{item.preparationTime} phút
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <EllipsisPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
