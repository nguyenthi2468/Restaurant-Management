import { useQuery } from '@tanstack/react-query';
import {
  getShifts,
  getActiveShifts,
  getShiftById,
  getEmployeeSchedules,
  getEmployeeSchedulesByEmployee,
  getEmployeeScheduleById,
  getAttendances,
  getAttendancesByEmployee,
  getAttendanceById,
  getTimeOffRequests,
  getTimeOffRequestsByEmployee,
  getTimeOffRequestById,
} from './api';
import {
  QueryEmployeeScheduleDto,
  QueryAttendanceDto,
  QueryTimeOffRequestDto,
} from './types';

export const useShiftsQuery = () => {
  return useQuery({
    queryKey: ['shifts'],
    queryFn: () => getShifts(),
  });
};

export const useActiveShiftsQuery = () => {
  return useQuery({
    queryKey: ['shifts', 'active'],
    queryFn: () => getActiveShifts(),
  });
};

export const useShiftQuery = (id: string) => {
  return useQuery({
    queryKey: ['shift', id],
    queryFn: () => getShiftById(id),
    enabled: !!id,
  });
};

export const useEmployeeSchedulesQuery = (
  params?: QueryEmployeeScheduleDto,
) => {
  return useQuery({
    queryKey: ['employee-schedules', params],
    queryFn: () => getEmployeeSchedules(params),
  });
};

export const useEmployeeSchedulesByEmployeeQuery = (
  employeeId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: [
      'employee-schedules',
      'employee',
      employeeId,
      { startDate, endDate },
    ],
    queryFn: () =>
      getEmployeeSchedulesByEmployee(employeeId, startDate, endDate),
    enabled: !!employeeId,
  });
};

export const useEmployeeScheduleQuery = (id: string) => {
  return useQuery({
    queryKey: ['employee-schedule', id],
    queryFn: () => getEmployeeScheduleById(id),
    enabled: !!id,
  });
};

export const useAttendancesQuery = (params?: QueryAttendanceDto) => {
  return useQuery({
    queryKey: ['attendances', params],
    queryFn: () => getAttendances(params),
  });
};

export const useAttendancesByEmployeeQuery = (
  employeeId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['attendances', 'employee', employeeId, { startDate, endDate }],
    queryFn: () => getAttendancesByEmployee(employeeId, startDate, endDate),
    enabled: !!employeeId,
  });
};

export const useAttendanceQuery = (id: string) => {
  return useQuery({
    queryKey: ['attendance', id],
    queryFn: () => getAttendanceById(id),
    enabled: !!id,
  });
};

export const useTimeOffRequestsQuery = (params?: QueryTimeOffRequestDto) => {
  return useQuery({
    queryKey: ['time-off-requests', params],
    queryFn: () => getTimeOffRequests(params),
  });
};

export const useTimeOffRequestsByEmployeeQuery = (employeeId: string) => {
  return useQuery({
    queryKey: ['time-off-requests', 'employee', employeeId],
    queryFn: () => getTimeOffRequestsByEmployee(employeeId),
    enabled: !!employeeId,
  });
};

export const useTimeOffRequestQuery = (id: string) => {
  return useQuery({
    queryKey: ['time-off-request', id],
    queryFn: () => getTimeOffRequestById(id),
    enabled: !!id,
  });
};
