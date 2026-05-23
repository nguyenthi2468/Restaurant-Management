import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem } from '@/features/menu-items';
import { formatCurrency } from '@/utils/currency';
import { ChefHat, Leaf, Wheat, Flame } from 'lucide-react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuGridProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  hasSelectedTable: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MenuGrid({
  menuItems,
  onAddItem,
  hasSelectedTable,
  currentPage,
  totalPages,
  onPageChange,
}: MenuGridProps) {
  const handleItemClick = (item: MenuItem) => {
    if (!hasSelectedTable) {
      alert('Vui lòng chọn bàn trước');
      return;
    }
    onAddItem(item);
  };

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {menuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ChefHat size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-base font-medium">
                Chưa có món ăn nào
              </p>
              <p className="text-slate-400 text-sm mt-1">
                Vui lòng thêm món ăn vào thực đơn
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image.url || '/images/placeholder.jpeg'}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
                        <ChefHat size={40} className="text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.isSpicy && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        <Flame size={12} className="inline mr-0.5" />
                        Cay
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                      {item.category?.name || 'Không phân loại'}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                      {item.isVegetarian && (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          <Leaf size={10} />
                          Chay
                        </span>
                      )}
                      {item.isVegan && (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                          <Leaf size={10} />
                          Vegan
                        </span>
                      )}
                      {item.isGlutenFree && (
                        <span className="inline-flex items-center gap-0.5 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                          <Wheat size={10} />
                          Không gluten
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <span className="text-base font-bold text-blue-600">
                        {formatCurrency(item.price)}
                      </span>
                      {!item.isAvailable && (
                        <span className="block text-xs text-red-500 mt-1">
                          Tạm hết
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-end px-4 py-2 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-slate-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
