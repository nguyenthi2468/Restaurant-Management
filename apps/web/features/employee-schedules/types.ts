import { User } from '../user';

export enum ShiftType {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  FULL_DAY = 'FULL_DAY',
}

export interface Shift {
  id: string;
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftData {
  name: string;
  type: ShiftType;
  startTime: string;
  endTime: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateShiftData {
  name?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  isActive?: boolean;
}

export interface EmployeeSchedule {
  id: string;
  employeeId: string;
  shiftId: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  employee?: User;
  shift?: Shift;
}

export interface CreateEmployeeScheduleData {
  employeeId: string;
  shiftId: string;
  date: Date | string;
  note?: string;
}

export interface UpdateEmployeeScheduleData {
  employeeId?: string;
  shiftId?: string;
  date?: Date | string;
  note?: string;
}

export interface QueryEmployeeScheduleDto {
  employeeId?: string;
  shiftId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export enum AttendanceStatus {
  ON_TIME = 'ON_TIME',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  workHours?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateAttendanceData {
  employeeId: string;
  date: Date | string;
  clockIn?: Date | string;
  clockOut?: Date | string;
  status: AttendanceStatus;
  workHours?: number;
  note?: string;
}

export interface UpdateAttendanceData {
  employeeId?: string;
  date?: Date | string;
  clockIn?: Date | string;
  clockOut?: Date | string;
  status?: AttendanceStatus;
  workHours?: number;
  note?: string;
}

export interface QueryAttendanceDto {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  page?: number;
  limit?: number;
}

export interface ClockInData {
  employeeId: string;
  clockIn?: Date | string;
}

export interface ClockOutData {
  employeeId: string;
  clockOut?: Date | string;
}

export interface ClockInOtpData {
  employeeId: string;
  otp: string;
}

export interface ClockOutOtpData {
  employeeId: string;
  otp: string;
}

export enum TimeOffRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum TimeOffRequestType {
  SICK_LEAVE = 'SICK_LEAVE',
  VACATION = 'VACATION',
  PERSONAL = 'PERSONAL',
  UNPAID = 'UNPAID',
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  type: TimeOffRequestType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: TimeOffRequestStatus;
  reviewNote?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateTimeOffRequestData {
  employeeId: string;
  type: TimeOffRequestType;
  startDate: Date | string;
  endDate: Date | string;
  reason?: string;
}

export interface UpdateTimeOffRequestData {
  type?: TimeOffRequestType;
  startDate?: Date | string;
  endDate?: Date | string;
  reason?: string;
  status?: TimeOffRequestStatus;
}

export interface QueryTimeOffRequestDto {
  employeeId?: string;
  type?: TimeOffRequestType;
  status?: TimeOffRequestStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PaginatedShiftResponse = PaginatedResponse<Shift>;
export type PaginatedEmployeeScheduleResponse =
  PaginatedResponse<EmployeeSchedule>;
export type PaginatedAttendanceResponse = PaginatedResponse<Attendance>;
export type PaginatedTimeOffRequestResponse = PaginatedResponse<TimeOffRequest>;
