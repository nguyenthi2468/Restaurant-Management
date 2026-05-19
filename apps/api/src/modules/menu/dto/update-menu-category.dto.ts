import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMenuCategoryDto } from './create-menu-category.dto';

export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {
  @ApiPropertyOptional({
    description: 'Tên danh mục menu',
    example: 'Món chính cập nhật',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Mô tả danh mục menu',
    example: 'Các món ăn chính trong bữa ăn - phiên bản mới',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'ID hình ảnh danh mục',
    example: 'image_456def',
  })
  @IsString()
  @IsOptional()
  imageId?: string;

  @ApiPropertyOptional({
    description: 'Vị trí hiển thị',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}