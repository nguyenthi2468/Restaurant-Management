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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import {
  useTimeOffRequestsByEmployeeQuery,
  useCreateTimeOffRequestMutation,
  TimeOffRequestStatus,
  TimeOffRequestType,
} from '@/features/employee-schedules';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

interface CreateTimeOffRequestForm {
  type: TimeOffRequestType;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function MyTimeOffRequestsPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: requests, isLoading } = useTimeOffRequestsByEmployeeQuery(
    user?.id || '',
  );
  const createMutation = useCreateTimeOffRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateTimeOffRequestForm>({
    defaultValues: {
      type: TimeOffRequestType.ANNUAL_LEAVE,
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const selectedType = watch('type');

  const filteredRequests = requests?.filter((req) => {
    if (statusFilter === 'ALL') return true;
    return req.status === statusFilter;
  });

  const getStatusBadge = (status: TimeOffRequestStatus) => {
    const statusConfig = {
      [TimeOffRequestStatus.PENDING]: {
        label: 'Chờ duyệt',
        variant: 'secondary' as const,
        icon: Clock,
      },
      [TimeOffRequestStatus.APPROVED]: {
        label: 'Đã duyệt',
        variant: 'default' as const,
        icon: CheckCircle,
      },
      [TimeOffRequestStatus.REJECTED]: {
        label: 'Từ chối',
        variant: 'destructive' as const,
        icon: XCircle,
      },
      [TimeOffRequestStatus.CANCELLED]: {
        label: 'Đã hủy',
        variant: 'outline' as const,
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: TimeOffRequestType) => {
    const typeLabels = {
      [TimeOffRequestType.SICK_LEAVE]: 'Nghỉ ốm',
      [TimeOffRequestType.ANNUAL_LEAVE]: 'Nghỉ phép năm',
      [TimeOffRequestType.PERSONAL_LEAVE]: 'Nghỉ cá nhân',
      [TimeOffRequestType.UNPAID_LEAVE]: 'Nghỉ không lương',
      [TimeOffRequestType.OTHER]: 'Khác',
    };
    return typeLabels[type] || type;
  };

  const onSubmit = async (data: CreateTimeOffRequestForm) => {
    if (!user?.id) {
      toast.error('Không tìm thấy thông tin người dùng');
      return;
    }

    createMutation.mutate(
      {
        employeeId: user.id,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          toast.success('Tạo yêu cầu nghỉ phép thành công');
          setIsDialogOpen(false);
          reset();
        },
      },
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Yêu cầu nghỉ phép</h1>
          <p className="text-muted-foreground">
            Quản lý các yêu cầu nghỉ phép của bạn
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo yêu cầu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Tạo yêu cầu nghỉ phép</DialogTitle>
                <DialogDescription>
                  Điền thông tin yêu cầu nghỉ phép của bạn
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Loại nghỉ phép</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) =>
                      setValue('type', value as TimeOffRequestType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TimeOffRequestType.ANNUAL_LEAVE}>
                        Nghỉ phép năm
                      </SelectItem>
                      <SelectItem value={TimeOffRequestType.SICK_LEAVE}>
                        Nghỉ ốm
                      </SelectItem>
                      <SelectItem value={TimeOffRequestType.PERSONAL_LEAVE}>
                        Nghỉ cá nhân
                      </SelectItem>
                      <SelectItem value={TimeOffRequestType.UNPAID_LEAVE}>
                        Nghỉ không lương
                      </SelectItem>
                      <SelectItem value={TimeOffRequestType.OTHER}>
                        Khác
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate', {
                      required: 'Vui lòng chọn ngày bắt đầu',
                    })}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate', {
                      required: 'Vui lòng chọn ngày kết thúc',
                    })}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do</Label>
                  <Textarea
                    id="reason"
                    placeholder="Nhập lý do nghỉ phép..."
                    {...register('reason')}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Đang xử lý...' : 'Tạo yêu cầu'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả</SelectItem>
            <SelectItem value={TimeOffRequestStatus.PENDING}>
              Chờ duyệt
            </SelectItem>
            <SelectItem value={TimeOffRequestStatus.APPROVED}>
              Đã duyệt
            </SelectItem>
            <SelectItem value={TimeOffRequestStatus.REJECTED}>
              Từ chối
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Đang tải dữ liệu...
        </div>
      ) : !filteredRequests || filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {statusFilter === 'ALL'
                  ? 'Bạn chưa có yêu cầu nghỉ phép nào'
                  : 'Không có yêu cầu nào với trạng thái này'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {getTypeLabel(request.type)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(request.startDate), 'dd/MM/yyyy', {
                        locale: vi,
                      })}{' '}
                      -{' '}
                      {format(new Date(request.endDate), 'dd/MM/yyyy', {
                        locale: vi,
                      })}
                    </CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.reason && (
                  <div>
                    <p className="text-sm font-medium mb-1">Lý do:</p>
                    <p className="text-sm text-muted-foreground">
                      {request.reason}
                    </p>
                  </div>
                )}
                {request.reviewNote && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium mb-1">
                      Ghi chú từ người duyệt:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.reviewNote}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                  <span>
                    Tạo lúc:{' '}
                    {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi,
                    })}
                  </span>
                  {request.reviewedAt && (
                    <span>
                      Duyệt lúc:{' '}
                      {format(
                        new Date(request.reviewedAt),
                        'dd/MM/yyyy HH:mm',
                        { locale: vi },
                      )}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
