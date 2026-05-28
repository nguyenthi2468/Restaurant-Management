import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { EmployeeScheduleController } from './employee-schedule.controller';
import { EmployeeScheduleService } from './employee-schedule.service';
import { TimeOffRequestController } from './time-off-request.controller';
import { TimeOffRequestService } from './time-off-request.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    ShiftController,
    EmployeeScheduleController,
    TimeOffRequestController,
    AttendanceController,
  ],
  providers: [
    ShiftService,
    EmployeeScheduleService,
    TimeOffRequestService,
    AttendanceService,
  ],
  exports: [
    ShiftService,
    EmployeeScheduleService,
    TimeOffRequestService,
    AttendanceService,
  ],
})
export class EmployeeSchedulesModule {}
