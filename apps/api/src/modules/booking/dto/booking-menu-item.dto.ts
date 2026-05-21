import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class BookingMenuItemDto {
  @ApiProperty({ description: 'The unique identifier of the booking menu item entry' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The ID of the booking this item belongs to' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ description: 'The ID of the menu item' })
  @IsUUID()
  menuItemId: string;

  @ApiProperty({ description: 'The quantity of the menu item' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'The price of the menu item at the time of booking' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'The creation timestamp of the booking menu item entry' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp of the booking menu item entry' })
  updatedAt: Date;
}