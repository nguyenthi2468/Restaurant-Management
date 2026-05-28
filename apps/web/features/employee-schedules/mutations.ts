import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createShift,
  updateShift,
  deleteShift,
  createEmployeeSchedule,
  updateEmployeeSchedule,
  deleteEmployeeSchedule,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  clockIn,
  clockOut,
  createTimeOffRequest,
  updateTimeOffRequest,
  deleteTimeOffRequest,
  approveTimeOffRequest,
  rejectTimeOffRequest,
} from './api';
import { toast } from 'react-hot-toast';
import {
  CreateShiftData,
  UpdateShiftData,
  CreateEmployeeScheduleData,
  UpdateEmployeeScheduleData,
  CreateAttendanceData,
  UpdateAttendanceData,
  ClockInData,
  ClockOutData,
  CreateTimeOffRequestData,
  UpdateTimeOffRequestData,
} from './types';

export const useCreateShiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShiftData) => createShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Tạo ca làm việc thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể tạo ca làm việc',
      );
      console.error(error);
    },
  });
};

export const useUpdateShiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShiftData }) =>
      updateShift(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['shift', id] });
      toast.success('Cập nhật ca làm việc thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật ca làm việc',
      );
      console.error(error);
    },
  });
};

export const useDeleteShiftMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Xóa ca làm việc thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể xóa ca làm việc',
      );
      console.error(error);
    },
  });
};

export const useCreateEmployeeScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEmployeeScheduleData) =>
      createEmployeeSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-schedules'] });
      toast.success('Phân ca làm việc thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể phân ca làm việc',
      );
      console.error(error);
    },
  });
};

export const useUpdateEmployeeScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeScheduleData;
    }) => updateEmployeeSchedule(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employee-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['employee-schedule', id] });
      toast.success('Cập nhật lịch làm việc thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật lịch làm việc',
      );
      console.error(error);
    },
  });
};

export const useDeleteEmployeeScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEmployeeSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-schedules'] });
      toast.success('Xóa lịch làm việc thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể xóa lịch làm việc',
      );
      console.error(error);
    },
  });
};

export const useCreateAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAttendanceData) => createAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast.success('Tạo bản ghi chấm công thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể tạo bản ghi chấm công',
      );
      console.error(error);
    },
  });
};

export const useUpdateAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttendanceData }) =>
      updateAttendance(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', id] });
      toast.success('Cập nhật bản ghi chấm công thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Không thể cập nhật bản ghi chấm công',
      );
      console.error(error);
    },
  });
};

export const useDeleteAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast.success('Xóa bản ghi chấm công thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể xóa bản ghi chấm công',
      );
      console.error(error);
    },
  });
};

export const useClockInMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClockInData) => clockIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast.success('Chấm công vào thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể chấm công vào');
      console.error(error);
    },
  });
};

export const useClockOutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClockOutData) => clockOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      toast.success('Chấm công ra thành công');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể chấm công ra');
      console.error(error);
    },
  });
};

export const useCreateTimeOffRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimeOffRequestData) => createTimeOffRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      toast.success('Tạo yêu cầu nghỉ phép thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể tạo yêu cầu nghỉ phép',
      );
      console.error(error);
    },
  });
};

export const useUpdateTimeOffRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTimeOffRequestData;
    }) => updateTimeOffRequest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      queryClient.invalidateQueries({ queryKey: ['time-off-request', id] });
      toast.success('Cập nhật yêu cầu nghỉ phép thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Không thể cập nhật yêu cầu nghỉ phép',
      );
      console.error(error);
    },
  });
};

export const useDeleteTimeOffRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTimeOffRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      toast.success('Xóa yêu cầu nghỉ phép thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể xóa yêu cầu nghỉ phép',
      );
      console.error(error);
    },
  });
};

export const useApproveTimeOffRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: string; reviewNote?: string }) =>
      approveTimeOffRequest(id, reviewNote),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      queryClient.invalidateQueries({
        queryKey: ['time-off-request', data.id],
      });
      toast.success('Phê duyệt yêu cầu nghỉ phép thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Không thể phê duyệt yêu cầu nghỉ phép',
      );
      console.error(error);
    },
  });
};

export const useRejectTimeOffRequestMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: string; reviewNote?: string }) =>
      rejectTimeOffRequest(id, reviewNote),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['time-off-requests'] });
      queryClient.invalidateQueries({
        queryKey: ['time-off-request', data.id],
      });
      toast.success('Từ chối yêu cầu nghỉ phép thành công');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Không thể từ chối yêu cầu nghỉ phép',
      );
      console.error(error);
    },
  });
};
