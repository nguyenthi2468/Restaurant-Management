import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List, Bike, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'tables' | 'menu';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TabNavigation({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
}: TabNavigationProps) {
  return (
    <div className="flex items-center gap-2 px-4 pt-3 pb-2">
      <button
        onClick={() => onTabChange('tables')}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'tables'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-200',
        )}
      >
        <LayoutGrid size={16} />
        Phòng bàn
      </button>
      <button
        onClick={() => onTabChange('menu')}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'menu'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-200',
        )}
      >
        <List size={16} />
        Thực đơn
      </button>
      {/* <button
        onClick={() => onTabChange('delivery')}
        className={cn(
          'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
          activeTab === 'delivery'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-slate-600 hover:bg-slate-200',
        )}
      >
        <Bike size={16} />
        Giao đi
      </button> */}

      <div className="flex-1" />
      {activeTab === 'menu' && 
      (
      <div className="relative w-64">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          placeholder="Tìm món"
          className="pl-9 h-9 bg-white text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      )}
    </div>
  );
}
