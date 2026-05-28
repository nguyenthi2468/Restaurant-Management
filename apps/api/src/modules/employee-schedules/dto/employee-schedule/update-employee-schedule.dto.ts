import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeScheduleDto } from './create-employee-schedule.dto';

export class UpdateEmployeeScheduleDto extends PartialType(CreateEmployeeScheduleDto) {}
