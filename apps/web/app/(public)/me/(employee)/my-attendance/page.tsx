'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import {
  useAttendancesByEmployeeQuery,
  AttendanceStatus,
} from '@/features/employee-schedules';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function MyAttendancePage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const startDate = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');

  const { data: attendances, isLoading } = useAttendancesByEmployeeQuery(
    user?.id || '',
    startDate,
    endDate,
  );
 const formatWorkHours = (hours?: number) => {
    if (hours == null) return '-';
    const numHours = typeof hours === 'number' ? hours : Number(hours);
    if (isNaN(numHours)) return '-';
    return `${numHours.toFixed(1)}h`;
  };
  const getStatusBadge = (status: AttendanceStatus) => {
    const statusConfig = {
      [AttendanceStatus.ON_TIME]: {
        label: 'Đúng giờ',
        variant: 'default' as const,
      },
      [AttendanceStatus.ABSENT]: {
        label: 'Vắng mặt',
        variant: 'destructive' as const,
      },
      [AttendanceStatus.LATE]: {
        label: 'Đi muộn',
        variant: 'secondary' as const,
      },
      [AttendanceStatus.EXCUSED]: {
        label: 'Có phép',
        variant: 'outline' as const,
      },
    };

    const config = statusConfig[status] || {
      label: status,
      variant: 'outline' as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateStats = () => {
    if (!attendances || attendances.length === 0) {
      return {
        totalDays: 0,
        totalHours: 0,
        presentDays: 0,
        lateDays: 0,
        absentDays: 0,
      };
    }

    return {
      totalDays: attendances.length,
      totalHours: attendances.reduce(
        (sum, att) => sum + (att.workHours || 0),
        0,
      ),
      presentDays: attendances.filter(
        (att) => att.status === AttendanceStatus.ON_TIME,
      ).length,
      lateDays: attendances.filter(
        (att) => att.status === AttendanceStatus.LATE,
      ).length,
      absentDays: attendances.filter(
        (att) => att.status === AttendanceStatus.ABSENT,
      ).length,
    };
  };

  const stats = calculateStats();

  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: date.toISOString(),
      label: format(date, 'MMMM yyyy', { locale: vi }),
    };
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lịch sử chấm công</h1>
        <p className="text-muted-foreground">
          Xem lại lịch sử chấm công và thống kê của bạn
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select
            value={selectedMonth.toISOString()}
            onValueChange={(value) => setSelectedMonth(new Date(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tổng số ngày</CardDescription>
            <CardTitle className="text-3xl">{stats.totalDays}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Số ngày có bản ghi chấm công
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Tổng giờ làm việc</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Clock className="h-6 w-6" />
              {formatWorkHours(stats.totalHours)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Tổng số giờ làm việc trong tháng
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ngày có mặt</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {stats.presentDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Số ngày đi làm đúng giờ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Đi muộn / Vắng</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {stats.lateDays} / {stats.absentDays}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Số ngày đi muộn và vắng mặt
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bản ghi chấm công</CardTitle>
          <CardDescription>
            Danh sách chi tiết các ngày chấm công trong tháng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải dữ liệu...
            </div>
          ) : !attendances || attendances.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Không có bản ghi chấm công trong tháng này
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ vào</TableHead>
                    <TableHead>Giờ ra</TableHead>
                    <TableHead>Số giờ làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell className="font-medium">
                        {format(
                          new Date(attendance.date),
                          'dd/MM/yyyy (EEEE)',
                          {
                            locale: vi,
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        {attendance.clockIn
                          ? format(new Date(attendance.clockIn), 'HH:mm:ss')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {attendance.clockOut
                          ? format(new Date(attendance.clockOut), 'HH:mm:ss')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {attendance.workHours
                          ? formatWorkHours(attendance.workHours)
                          : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(attendance.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attendance.note || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
