'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { EmployeeSchedule } from '@/features/employee-schedules/types';
import { Badge } from '@/components/ui/badge';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

interface ScheduleCalendarProps {
  schedules: EmployeeSchedule[];
  onDateClick?: (date: Date) => void;
  isLoading?: boolean;
}

export function ScheduleCalendar({
  schedules,
  onDateClick,
  isLoading,
}: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { locale: vi });
  const endDate = endOfWeek(monthEnd, { locale: vi });

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const getSchedulesForDate = (date: Date) => {
    return schedules.filter((schedule) =>
      isSameDay(new Date(schedule.date), date),
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: vi })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hôm nay
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEEEEE';
    let startDateCopy = startDate;

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className="text-center text-sm font-medium text-muted-foreground py-2"
        >
          {format(addDays(startDateCopy, i), dateFormat, { locale: vi })}
        </div>,
      );
    }

    return <div className="grid grid-cols-7 gap-1">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const daySchedules = getSchedulesForDate(day);

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] border rounded-lg p-2 cursor-pointer transition-colors ${
              !isSameMonth(day, monthStart)
                ? 'bg-muted/30 text-muted-foreground'
                : 'bg-background hover:bg-muted/50'
            } ${isToday(day) ? 'ring-2 ring-primary' : ''}`}
            onClick={() => onDateClick?.(cloneDay)}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-sm font-medium ${
                  isToday(day) ? 'text-primary' : ''
                }`}
              >
                {formattedDate}
              </span>
              {daySchedules.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {daySchedules.length}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              {daySchedules.slice(0, 2).map((schedule) => (
                <div
                  key={schedule.id}
                  className="text-xs p-1 bg-primary/10 rounded truncate"
                >
                  <div className="text-muted-foreground truncate">
                    {schedule.shift?.name}
                  </div>
                </div>
              ))}
              {daySchedules.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{daySchedules.length - 2} khác
                </div>
              )}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      );
      days = [];
    }

    return <div className="space-y-1">{rows}</div>;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Đang tải...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </Card>
  );
}
