import { API_ENDPOINTS } from '@/constants';
import api from '@/lib/axios';
import {
  Shift,
  CreateShiftData,
  UpdateShiftData,
  EmployeeSchedule,
  CreateEmployeeScheduleData,
  UpdateEmployeeScheduleData,
  QueryEmployeeScheduleDto,
  PaginatedEmployeeScheduleResponse,
  Attendance,
  CreateAttendanceData,
  UpdateAttendanceData,
  QueryAttendanceDto,
  PaginatedAttendanceResponse,
  ClockInData,
  ClockOutData,
  TimeOffRequest,
  CreateTimeOffRequestData,
  UpdateTimeOffRequestData,
  QueryTimeOffRequestDto,
  PaginatedTimeOffRequestResponse,
} from './types';

export const getShifts = async () => {
  const response = await api.get<Shift[]>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.SHIFTS,
  );
  return response.data;
};

export const getActiveShifts = async () => {
  const response = await api.get<Shift[]>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SHIFTS}/active`,
  );
  return response.data;
};

export const getShiftById = async (id: string) => {
  const response = await api.get<Shift>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SHIFTS}/${id}`,
  );
  return response.data;
};

export const createShift = async (data: CreateShiftData) => {
  const response = await api.post<Shift>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.SHIFTS,
    data,
  );
  return response.data;
};

export const updateShift = async (id: string, data: UpdateShiftData) => {
  const response = await api.patch<Shift>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SHIFTS}/${id}`,
    data,
  );
  return response.data;
};

export const deleteShift = async (id: string) => {
  const response = await api.delete<Shift>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SHIFTS}/${id}`,
  );
  return response.data;
};

export const getEmployeeSchedules = async (
  params?: QueryEmployeeScheduleDto,
) => {
  const response = await api.get<PaginatedEmployeeScheduleResponse>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.SCHEDULES,
    { params },
  );
  return response.data;
};

export const getEmployeeSchedulesByEmployee = async (
  employeeId: string,
  startDate?: string,
  endDate?: string,
) => {
  const response = await api.get<EmployeeSchedule[]>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SCHEDULES}/employee/${employeeId}`,
    { params: { startDate, endDate } },
  );
  return response.data;
};

export const getEmployeeScheduleById = async (id: string) => {
  const response = await api.get<EmployeeSchedule>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SCHEDULES}/${id}`,
  );
  return response.data;
};

export const createEmployeeSchedule = async (
  data: CreateEmployeeScheduleData,
) => {
  const response = await api.post<EmployeeSchedule>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.SCHEDULES,
    data,
  );
  return response.data;
};

export const updateEmployeeSchedule = async (
  id: string,
  data: UpdateEmployeeScheduleData,
) => {
  const response = await api.patch<EmployeeSchedule>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SCHEDULES}/${id}`,
    data,
  );
  return response.data;
};

export const deleteEmployeeSchedule = async (id: string) => {
  const response = await api.delete<EmployeeSchedule>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.SCHEDULES}/${id}`,
  );
  return response.data;
};

export const getAttendances = async (params?: QueryAttendanceDto) => {
  const response = await api.get<PaginatedAttendanceResponse>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE,
    { params },
  );
  return response.data;
};

export const getAttendancesByEmployee = async (
  employeeId: string,
  startDate?: string,
  endDate?: string,
) => {
  const response = await api.get<Attendance[]>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/employee/${employeeId}`,
    { params: { startDate, endDate } },
  );
  return response.data;
};

export const getAttendanceById = async (id: string) => {
  const response = await api.get<Attendance>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/${id}`,
  );
  return response.data;
};

export const createAttendance = async (data: CreateAttendanceData) => {
  const response = await api.post<Attendance>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE,
    data,
  );
  return response.data;
};

export const updateAttendance = async (
  id: string,
  data: UpdateAttendanceData,
) => {
  const response = await api.patch<Attendance>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/${id}`,
    data,
  );
  return response.data;
};

export const deleteAttendance = async (id: string) => {
  const response = await api.delete<Attendance>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/${id}`,
  );
  return response.data;
};

export const clockIn = async (data: ClockInData) => {
  const response = await api.post<Attendance>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/clock-in`,
    data,
  );
  return response.data;
};

export const clockOut = async (data: ClockOutData) => {
  const response = await api.post<Attendance>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/clock-out`,
    data,
  );
  return response.data;
};

export const getTimeOffRequests = async (params?: QueryTimeOffRequestDto) => {
  const response = await api.get<PaginatedTimeOffRequestResponse>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS,
    { params },
  );
  return response.data;
};

export const getTimeOffRequestsByEmployee = async (employeeId: string) => {
  const response = await api.get<TimeOffRequest[]>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS}/employee/${employeeId}`,
  );
  return response.data;
};

export const getTimeOffRequestById = async (id: string) => {
  const response = await api.get<TimeOffRequest>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS}/${id}`,
  );
  return response.data;
};

export const createTimeOffRequest = async (data: CreateTimeOffRequestData) => {
  const response = await api.post<TimeOffRequest>(
    API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS,
    data,
  );
  return response.data;
};

export const updateTimeOffRequest = async (
  id: string,
  data: UpdateTimeOffRequestData,
) => {
  const response = await api.patch<TimeOffRequest>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS}/${id}`,
    data,
  );
  return response.data;
};

export const deleteTimeOffRequest = async (id: string) => {
  const response = await api.delete<TimeOffRequest>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS}/${id}`,
  );
  return response.data;
};

export const approveTimeOffRequest = async (
  id: string,
  reviewNote?: string,
) => {
  const response = await api.post<TimeOffRequest>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS}/${id}/approve`,
    { reviewNote },
  );
  return response.data;
};

export const rejectTimeOffRequest = async (id: string, reviewNote?: string) => {
  const response = await api.post<TimeOffRequest>(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.TIME_OFF_REQUESTS}/${id}/reject`,
    { reviewNote },
  );
  return response.data;
};

export const getQRCode = async (employeeId: string) => {
  const response = await api.get(
    `${API_ENDPOINTS.EMPLOYEE_SCHEDULES.ATTENDANCE}/qdcode/${employeeId}`,
    { responseType: 'blob' },
  );
  return URL.createObjectURL(response.data);
};
