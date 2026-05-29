'use client';

import { useState } from 'react';
import { formatCurrency } from '@/utils/currency';
import { useMenuCategoriesWithMenuItemsQuery } from '@/features/menu-categories/queries';

export default function MenuCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: apiCategories,
    isLoading,
    isError,
  } = useMenuCategoriesWithMenuItemsQuery();

  const colorPalette = [
    'from-blue-500/20',
    'from-amber-500/20',
    'from-rose-500/20',
    'from-purple-500/20',
    'from-green-500/20',
    'from-indigo-500/20',
  ];

  const categories =
    apiCategories
      ?.filter((cat) => cat.isActive)
      .map((cat, idx) => ({
        id: cat.id,
        name: cat.name,
        color: colorPalette[idx % colorPalette.length],
      })) || [];

  const menuItems =
    apiCategories?.flatMap((cat) =>
      cat.menuItems
        .filter((item) => item.isAvailable)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: cat.id,
          vegetarian: item.isVegetarian,
          vegan: item.isVegan,
        })),
    ) || [];

  if (isLoading) {
    return (
      <section
        id="menu-categories"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-foreground/60">Đang tải thực đơn...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        id="menu-categories"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-red-500">
            Không thể tải thực đơn. Vui lòng thử lại sau.
          </p>
        </div>
      </section>
    );
  }

  if (!isLoading && categories.length === 0) {
    return (
      <section
        id="menu-categories"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-foreground/60">
            Chưa có danh mục thực đơn nào.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="menu-categories"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Toàn bộ thực đơn
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Khám phá đầy đủ các món ăn được tuyển chọn cẩn thận của chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {categories.map((cat, idx) => {
            const items = menuItems.filter((item) => item.category === cat.id);
            return (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? null : cat.id,
                  )
                }
                className="relative group"
              >
                <div
                  className={`relative h-40 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedCategory === cat.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.color} to-transparent`}
                  ></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-t from-card/80 via-card/40 to-transparent group-hover:from-card group-hover:via-card/60 transition-all duration-300">
                    <h3 className="text-lg font-serif font-bold text-foreground text-center">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-2">
                      {items.length} món
                    </p>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-lg transition-colors duration-300"></div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="mt-12">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-8">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems
                .filter((item) => item.category === selectedCategory)
                .map((menuItem, idx) => (
                  <div
                    key={menuItem.id}
                    className="bg-card rounded-lg p-6 border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-foreground">
                          {menuItem.name}
                        </h4>
                        <div className="flex gap-2 mt-2">
                          {menuItem.vegetarian && (
                            <span className="px-2 py-1 bg-green-100/30 text-green-700 text-xs rounded font-medium">
                              Ăn chay
                            </span>
                          )}
                          {menuItem.vegan && (
                            <span className="px-2 py-1 bg-green-100/50 text-green-800 text-xs rounded font-medium">
                              Thuần chay
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xl font-serif font-bold text-primary ml-4 flex-shrink-0">
                        {formatCurrency(menuItem.price)}
                      </span>
                    </div>

                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {menuItem.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-6 flex items-center gap-3">
                  {cat.name}
                </h3>
                <div className="space-y-4">
                  {menuItems
                    .filter((item) => item.category === cat.id)
                    .slice(0, 3)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="pb-4 border-b border-border/30"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-serif font-bold text-foreground">
                            {item.name}
                          </h4>
                          <span className="text-primary font-bold ml-4 flex-shrink-0">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/70">
                          {item.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href="#contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Đặt bàn
          </a>
        </div>
      </div>
    </section>
  );
}
