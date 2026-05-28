import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceDto {
  @ApiProperty({ description: 'Attendance ID' })
  id: string;

  @ApiProperty({ description: 'Employee ID' })
  employeeId: string;

  @ApiProperty({ description: 'Attendance date' })
  date: Date;

  @ApiProperty({ description: 'Clock-in time', required: false })
  clockIn?: Date;

  @ApiProperty({ description: 'Clock-out time', required: false })
  clockOut?: Date;

  @ApiProperty({ description: 'Attendance status', enum: AttendanceStatus })
  status: AttendanceStatus;

  @ApiProperty({ description: 'Work hours', required: false })
  workHours?: number;

  @ApiProperty({ description: 'Overtime hours', required: false })
  overtimeHours?: number;

  @ApiProperty({ description: 'Note', required: false })
  note?: string;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;

  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
