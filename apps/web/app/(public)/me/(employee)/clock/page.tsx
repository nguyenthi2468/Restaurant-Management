'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut, Calendar, Timer } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import {
  useClockInMutation,
  useClockOutMutation,
  useAttendancesByEmployeeQuery,
  AttendanceStatus,
} from '@/features/employee-schedules';
import { format, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function ClockPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  const clockInMutation = useClockInMutation();
  const clockOutMutation = useClockOutMutation();

  const today = new Date();
  const { data: attendances, isLoading } = useAttendancesByEmployeeQuery(
    user?.id || '',
    format(startOfDay(today), 'yyyy-MM-dd'),
    format(endOfDay(today), 'yyyy-MM-dd'),
  );

  const todayAttendance = attendances?.[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    if (!user?.id) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    clockInMutation.mutate(
      { employeeId: user.id },
    );
  };

  const handleClockOut = async () => {
    if (!user?.id) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    clockOutMutation.mutate(
      { employeeId: user.id },
    );
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

  const hasClockIn = todayAttendance && todayAttendance.clockIn;
  const hasClockOut = todayAttendance && todayAttendance.clockOut;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chấm công</h1>
        <p className="text-muted-foreground">
          Chấm công vào và ra cho ngày làm việc của bạn
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Clock className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold">
              {format(currentTime, 'HH:mm:ss')}
            </CardTitle>
            <CardDescription className="text-lg">
              {format(currentTime, 'EEEE, dd MMMM yyyy', { locale: vi })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                onClick={handleClockIn}
                // disabled={hasClockIn || clockInMutation.isPending || isLoading}
                className="h-20 text-lg"
              >
                {clockInMutation.isPending ? (
                  <>Đang xử lý...</>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Chấm công vào
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleClockOut}
                // disabled={
                //   !hasClockIn ||
                //   hasClockOut ||
                //   clockOutMutation.isPending ||
                //   isLoading
                // }
                className="h-20 text-lg"
              >
                {clockOutMutation.isPending ? (
                  <>Đang xử lý...</>
                ) : (
                  <>
                    <LogOut className="mr-2 h-5 w-5" />
                    Chấm công ra
                  </>
                )}
              </Button>
            </div>

            {!hasClockIn && (
              <div className="text-center text-sm text-muted-foreground">
                Nhấn "Chấm công vào" để bắt đầu ngày làm việc
              </div>
            )}
            {hasClockIn && !hasClockOut && (
              <div className="text-center text-sm text-muted-foreground">
                Đã chấm công vào. Nhấn "Chấm công ra" khi kết thúc ca làm việc
              </div>
            )}
            {hasClockIn && hasClockOut && (
              <div className="text-center text-sm text-green-600 font-medium">
                Đã hoàn thành chấm công hôm nay
              </div>
            )}
          </CardContent>
        </Card>

        {todayAttendance && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bản ghi chấm công hôm nay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Giờ vào</p>
                  <p className="text-lg font-semibold">
                    {todayAttendance.clockIn
                      ? format(new Date(todayAttendance.clockIn), 'HH:mm:ss')
                      : '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Giờ ra</p>
                  <p className="text-lg font-semibold">
                    {todayAttendance.clockOut
                      ? format(new Date(todayAttendance.clockOut), 'HH:mm:ss')
                      : '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Số giờ làm</p>
                  <p className="text-lg font-semibold flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {todayAttendance.workHours
                      ? `${todayAttendance.workHours.toFixed(1)}h`
                      : '-'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <div>{getStatusBadge(todayAttendance.status)}</div>
                </div>
              </div>
              {todayAttendance.note && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                  <p className="text-sm">{todayAttendance.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
