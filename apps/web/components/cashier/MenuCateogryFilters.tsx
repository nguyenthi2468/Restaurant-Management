import { MenuCategory } from '@/features/menu-categories';
import { cn } from '@/lib/utils';

interface MenuCategoryFiltersProps {
  menuCategories: MenuCategory[];
  selectedMenuCategory: string;
  onMenuCategoryChange: (menuCategory: string) => void;
}

export function MenuCategoryFilters({
  menuCategories,
  selectedMenuCategory,
  onMenuCategoryChange,
}: MenuCategoryFiltersProps) {
  return (
    <div className='mx-3'>
    <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-100">
      <button
          onClick={() => onMenuCategoryChange('')}
          className={cn(
            'relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out',
            selectedMenuCategory === ''
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 hover:shadow-md hover:border-slate-300',
          )}
        >
          Tất cả
        </button>
      {menuCategories.map((c) => (
        <button
          key={c.id}
          onClick={() => onMenuCategoryChange(c.id)}
          className={cn(
            'relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out',
            selectedMenuCategory === c.id
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 hover:shadow-md hover:border-slate-300',
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
    </div>
  );
}
