import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục menu',
    example: 'Món chính',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả danh mục menu',
    example: 'Các món ăn chính trong bữa ăn',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'ID hình ảnh danh mục',
    example: 'image_123abc',
  })
  @IsString()
  @IsOptional()
  imageId?: string;

  @ApiPropertyOptional({
    description: 'Vị trí hiển thị',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  constructor(partial: Partial<CreateMenuCategoryDto>) {
    Object.assign(this, partial);
  }
}
