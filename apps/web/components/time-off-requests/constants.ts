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
  [TimeOffRequestType.ANNUAL_LEAVE]: 'Nghỉ phép năm',
  [TimeOffRequestType.PERSONAL_LEAVE]: 'Nghỉ cá nhân',
  [TimeOffRequestType.UNPAID_LEAVE]: 'Nghỉ không lương',
  [TimeOffRequestType.OTHER]: 'Khác',
};
