'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, FileText, User, Plus } from 'lucide-react';
import { ScheduleCalendar } from '@/components/employee-schedules/ScheduleCalendar';
import { AssignShiftDialog } from '@/components/employee-schedules/AssignShiftDialog';
import {
  useEmployeeSchedulesByEmployeeQuery,
  useAttendancesByEmployeeQuery,
  useTimeOffRequestsByEmployeeQuery,
} from '@/features/employee-schedules/queries';
import { useCreateEmployeeScheduleMutation } from '@/features/employee-schedules/mutations';
import { useUserByIdQuery, useUsersQuery } from '@/features/user/queries';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  AttendanceStatus,
  TimeOffRequestStatus,
} from '@/features/employee-schedules/types';
import { AssignShiftFormValues } from '@/features/employee-schedules/validator';

export default function EmployeeScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [startDate, setStartDate] = useState(
    format(startOfMonth(new Date()), 'yyyy-MM-dd'),
  );
  const [endDate, setEndDate] = useState(
    format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  );
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: employee } = useUserByIdQuery(employeeId);
  const { data: schedules, isLoading: schedulesLoading } =
    useEmployeeSchedulesByEmployeeQuery(employeeId, startDate, endDate);
  const { data: attendances, isLoading: attendancesLoading } =
    useAttendancesByEmployeeQuery(employeeId, startDate, endDate);
  const { data: timeOffRequests, isLoading: timeOffLoading } =
    useTimeOffRequestsByEmployeeQuery(employeeId);

  const createScheduleMutation = useCreateEmployeeScheduleMutation();

  const stats = useMemo(() => {
    const totalSchedules = schedules?.length || 0;
    const totalAttendances = attendances?.length || 0;
    const presentCount =
      attendances?.filter((a) => a.status === AttendanceStatus.ON_TIME)
        .length || 0;
    const totalHours =
      attendances?.reduce((sum, a) => sum + (Number(a.workHours) || 0), 0) || 0;

    return {
      totalSchedules,
      totalAttendances,
      presentCount,
      totalHours: totalHours.toFixed(1),
    };
  }, [schedules, attendances]);

  const getStatusBadge = (status: AttendanceStatus) => {
    const variants: Record<
      AttendanceStatus,
      'default' | 'secondary' | 'destructive'
    > = {
      [AttendanceStatus.ON_TIME]: 'default',
      [AttendanceStatus.ABSENT]: 'destructive',
      [AttendanceStatus.LATE]: 'secondary',
      [AttendanceStatus.EXCUSED]: 'default',
    };
    return variants[status] || 'default';
  };

  const getTimeOffStatusBadge = (status: TimeOffRequestStatus) => {
    const variants: Record<
      TimeOffRequestStatus,
      'default' | 'secondary' | 'destructive'
    > = {
      [TimeOffRequestStatus.PENDING]: 'secondary',
      [TimeOffRequestStatus.APPROVED]: 'default',
      [TimeOffRequestStatus.REJECTED]: 'destructive',
      [TimeOffRequestStatus.CANCELLED]: 'secondary',
    };
    return variants[status] || 'default';
  };

  const handleAssignShift = async (data: AssignShiftFormValues) => {
    await createScheduleMutation.mutateAsync({
      employeeId: employeeId,
      shiftId: data.shiftId,
      date: data.date,
      note: data.note,
    });
    setIsAssignDialogOpen(false);
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Không tìm thấy nhân viên
          </h3>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-4 md:m-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-muted-foreground">{employee.email}</p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Phân công lịch làm
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lịch làm việc</p>
              <p className="text-2xl font-bold">{stats.totalSchedules}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chấm công</p>
              <p className="text-2xl font-bold">
                {stats.presentCount}/{stats.totalAttendances}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng giờ làm</p>
              <p className="text-2xl font-bold">{stats.totalHours}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Yêu cầu nghỉ</p>
              <p className="text-2xl font-bold">
                {timeOffRequests?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="timeoff">Nghỉ phép</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
              <span>đến</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
            </div>
          </Card>

          <ScheduleCalendar
            schedules={schedules || []}
            isLoading={schedulesLoading}
          />
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Lịch sử chấm công</h3>
              {attendancesLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </div>
              ) : attendances && attendances.length > 0 ? (
                <div className="space-y-3">
                  {attendances.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {format(
                            new Date(attendance.date),
                            'dd/MM/yyyy - EEEE',
                            {
                              locale: vi,
                            },
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {attendance.clockIn
                            ? format(new Date(attendance.clockIn), 'HH:mm')
                            : '-'}{' '}
                          -{' '}
                          {attendance.clockOut
                            ? format(new Date(attendance.clockOut), 'HH:mm')
                            : '-'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm">
                          {attendance.workHours
                            ? `${attendance.workHours}h`
                            : '-'}
                        </span>
                        <Badge variant={getStatusBadge(attendance.status)}>
                          {attendance.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có dữ liệu chấm công
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeoff">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Yêu cầu nghỉ phép</h3>
              {timeOffLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </div>
              ) : timeOffRequests && timeOffRequests.length > 0 ? (
                <div className="space-y-3">
                  {timeOffRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{request.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(request.startDate), 'dd/MM/yyyy')} -{' '}
                          {format(new Date(request.endDate), 'dd/MM/yyyy')}
                        </p>
                        {request.reason && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {request.reason}
                          </p>
                        )}
                      </div>
                      <Badge variant={getTimeOffStatusBadge(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có yêu cầu nghỉ phép
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignShiftDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        schedule={null}
        onSubmit={handleAssignShift}
        isSubmitting={createScheduleMutation.isPending}
      />
    </div>
  );
}
