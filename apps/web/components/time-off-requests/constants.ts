import {
  TimeOffRequestStatus,
  TimeOffRequestType,
} from '@/features/employee-schedules/types';

export const statusColors: Record<TimeOffRequestStatus, string> = {
  [TimeOffRequestStatus.PENDING]: 'bg-yellow-500',
  [TimeOffRequestStatus.APPROVED]: 'bg-green-500',
  [TimeOffRequestStatus.REJECTED]: 'bg-red-500',
  [TimeOffRequestStatus.CANCELLED]: 'bg-gray-500',
};

export const statusLabels: Record<TimeOffRequestStatus, string> = {
  [TimeOffRequestStatus.PENDING]: 'Chờ duyệt',
  [TimeOffRequestStatus.APPROVED]: 'Đã duyệt',
  [TimeOffRequestStatus.REJECTED]: 'Từ chối',
  [TimeOffRequestStatus.CANCELLED]: 'Đã hủy',
};

export const typeLabels: Record<TimeOffRequestType, string> = {
  [TimeOffRequestType.SICK_LEAVE]: 'Nghỉ ốm',
  [TimeOffRequestType.VACATION]: 'Nghỉ phép năm',
  [TimeOffRequestType.PERSONAL]: 'Nghỉ cá nhân',
  [TimeOffRequestType.UNPAID]: 'Nghỉ không lương',
};
