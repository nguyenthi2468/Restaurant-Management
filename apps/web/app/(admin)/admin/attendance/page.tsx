'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, MapPin, ScanQrCode } from 'lucide-react';
import { useAttendancesQuery } from '@/features/employee-schedules/queries';
import {
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} from '@/features/employee-schedules/mutations';
import { AttendanceStatus } from '@/features/employee-schedules/types';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockInDialog } from '@/components/attendance/ClockInDialog';
import { ClockOutDialog } from '@/components/attendance/ClockOutDialog';
import { OtpDialog } from '@/components/attendance/OtpDialog';

const statusColors: Record<AttendanceStatus, string> = {
  [AttendanceStatus.ON_TIME]: 'bg-green-500',
  [AttendanceStatus.ABSENT]: 'bg-red-500',
  [AttendanceStatus.LATE]: 'bg-yellow-500',
  [AttendanceStatus.EXCUSED]: 'bg-blue-500',
};

const statusLabels: Record<AttendanceStatus, string> = {
  [AttendanceStatus.ON_TIME]: 'Có mặt',
  [AttendanceStatus.ABSENT]: 'Vắng mặt',
  [AttendanceStatus.LATE]: 'Đi muộn',
  [AttendanceStatus.EXCUSED]: 'Nghỉ phép',
};

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const [openClockInDialog, setOpenClockInDialog] = useState(false);
  const [openClockOutDialog, setOpenClockOutDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const limit = 10;

  const queryParams = {
    page,
    limit,
    status:
      statusFilter !== 'all' ? (statusFilter as AttendanceStatus) : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const { data, isLoading, error } = useAttendancesQuery(queryParams);
  const createMutation = useCreateAttendanceMutation();
  const updateMutation = useUpdateAttendanceMutation();
  const deleteMutation = useDeleteAttendanceMutation();

  const attendances = data?.data || [];
  const totalPages = data?.meta ? Math.ceil(data.meta.total / limit) : 0;

  const formatTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch {
      return '-';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateString;
    }
  };

  const formatWorkHours = (hours?: number) => {
    if (hours == null) return '-';
    const numHours = typeof hours === 'number' ? hours : Number(hours);
    if (isNaN(numHours)) return '-';
    return `${numHours.toFixed(1)}h`;
  };

  const handleStatusChange = (
    attendanceId: string,
    newStatus: AttendanceStatus,
  ) => {
    updateMutation.mutate({
      id: attendanceId,
      data: { status: newStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">
            Không thể tải dữ liệu chấm công
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Đã xảy ra lỗi'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-4 md:m-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý chấm công
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và quản lý chấm công nhân viên
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOpenOtpDialog(true)}>
            <ScanQrCode className="h-4 w-4 mr-2" />
            OTP
          </Button>
          <Button onClick={() => setOpenClockInDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Chấm công vào
          </Button>
          <Button onClick={() => setOpenClockOutDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Chấm công ra
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value={AttendanceStatus.ON_TIME}>
                  Đúng giờ
                </SelectItem>
                <SelectItem value={AttendanceStatus.ABSENT}>
                  Vắng mặt
                </SelectItem>
                <SelectItem value={AttendanceStatus.LATE}>Đi muộn</SelectItem>
                <SelectItem value={AttendanceStatus.EXCUSED}>
                  Có phép
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Từ ngày"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Đến ngày"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ vào</TableHead>
                <TableHead>Giờ ra</TableHead>
                <TableHead>Số giờ làm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Không có dữ liệu chấm công
                  </TableCell>
                </TableRow>
              ) : (
                attendances.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell className="font-medium">
                      {attendance.employee
                        ? `${attendance.employee.firstName} ${attendance.employee.lastName}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(attendance.date)}</TableCell>
                    <TableCell>{formatTime(attendance.clockIn)}</TableCell>
                    <TableCell>{formatTime(attendance.clockOut)}</TableCell>
                    <TableCell>
                      {formatWorkHours(attendance.workHours)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[attendance.status]} text-white`}
                      >
                        {statusLabels[attendance.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {attendance.note || '-'}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={attendance.status}
                        onValueChange={(value) =>
                          handleStatusChange(
                            attendance.id,
                            value as AttendanceStatus,
                          )
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AttendanceStatus.ON_TIME}>
                            Đúng giờ
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.ABSENT}>
                            Vắng mặt
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.LATE}>
                            Đi muộn
                          </SelectItem>
                          <SelectItem value={AttendanceStatus.EXCUSED}>
                            Có phép
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
      <ClockInDialog
        open={openClockInDialog}
        onOpenChange={setOpenClockInDialog}
      />
      <ClockOutDialog
        open={openClockOutDialog}
        onOpenChange={setOpenClockOutDialog}
      />
      <OtpDialog
        open={openOtpDialog}
        onOpenChange={setOpenOtpDialog}
      />
    </div>
  );
}
