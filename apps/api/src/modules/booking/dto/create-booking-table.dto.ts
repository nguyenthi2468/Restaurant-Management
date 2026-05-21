import { IsString } from 'class-validator';

export class CreateBookingTableDto {
  @IsString()
  tableId!: string;
}
