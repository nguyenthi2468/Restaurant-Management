import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDecimal,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IngredientDto } from './create-menu-item.dto';
import { OptionDto } from './create-menu-item.dto';

export class UpdateMenuItemDto {
  @ApiPropertyOptional({
    description: 'Tên món ăn',
    example: 'Pizza Margherita cập nhật',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Mô tả món ăn',
    example: 'Pizza truyền thống với sốt cà chua, phô mai mozzarella và lá húng quế - phiên bản mới',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Giá món ăn',
    example: 15.99,
    minimum: 0,
  })
  @IsDecimal()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'ID danh mục menu',
    example: 'cat_456def',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID hình ảnh món ăn',
    example: 'image_789ghi',
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
    description: 'Trạng thái có sẵn',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải món chay',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải món ăn pure chay (vegan)',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải không chứa gluten',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isGlutenFree?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải món cay',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isSpicy?: boolean;

  @ApiPropertyOptional({
    description: 'Thời gian chuẩn bị (phút)',
    example: 20,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  preparationTime?: number;

  @ApiPropertyOptional({
    description: 'Danh sách nguyên liệu',
    example: [
      {
        ingredientName: 'Sốt cà chua',
        quantity: 60,
        unit: 'g',
        isAllergen: false,
      },
      {
        ingredientName: 'Phô mai mozzarella',
        quantity: 120,
        unit: 'g',
        isAllergen: true,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @IsOptional()
  ingredients?: IngredientDto[];

  @ApiPropertyOptional({
    description: 'Danh sách tùy chọn (size, topping, etc.)',
    example: [
      {
        name: 'Kích thước',
        description: 'Chọn kích thước pizza',
        group: 'Size',
        isRequired: true,
        values: [
          {
            name: 'Nhỏ',
            description: 'Pizza kích thước nhỏ',
            priceAdjustment: 0,
          },
          {
            name: 'Vừa',
            description: 'Pizza kích thước vừa',
            priceAdjustment: 2,
          },
          {
            name: 'Lớn',
            description: 'Pizza kích thước lớn',
            priceAdjustment: 4,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsOptional()
  options?: OptionDto[];
}