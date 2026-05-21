import { IsInt, IsNumber, IsString } from 'class-validator';

export class CreateBookingMenuItemDto {
  @IsString()
  menuItemId!: string;

  @IsInt()
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  price!: number;
}
