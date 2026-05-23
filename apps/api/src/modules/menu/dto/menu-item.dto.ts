import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsDecimal, IsBoolean, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientDto {
  @ApiProperty({
    description: 'Tên nguyên liệu',
    example: 'Sốt cà chua',
  })
  ingredientName: string;

  @ApiProperty({
    description: 'Số lượng',
    example: 50,
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    description: 'Đơn vị tính',
    example: 'g',
  })
  @IsString()
  unit: string;

  @ApiPropertyOptional({
    description: 'Có phải nguyên liệu gây dị ứng',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isAllergen?: boolean;
}

export class MenuCategoryDto {
  @ApiProperty({
    description: 'ID danh mục',
    example: 'cat_123',
  })
  id: string;

  @ApiProperty({
    description: 'Tên danh mục',
    example: 'Pizza',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả danh mục',
    example: 'Các loại pizza',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Vị trí hiển thị',
    example: 1,
  })
  position?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái có sẵn',
    example: true,
  })
  isAvailable?: boolean;
}

export class ImageDto {
  @ApiProperty({
    description: 'ID hình ảnh',
    example: 'img_123',
  })
  id: string;

  @ApiProperty({
    description: 'URL hình ảnh',
    example: 'https://example.com/image.jpg',
  })
  url: string;

  @ApiPropertyOptional({
    description: 'Kích thước hình ảnh',
    example: 12345,
  })
  size?: number;

  @ApiPropertyOptional({
    description: 'Định dạng hình ảnh',
    example: 'jpg',
  })
  format?: string;
}
export class MenuItemDto {
  @ApiProperty({
    description: 'ID món ăn',
    example: 'menu_item_123',
  })
  id: string;

  @ApiProperty({
    description: 'Tên món ăn',
    example: 'Pizza Margherita',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả món ăn',
    example:
      'Pizza truyền thống với sốt cà chua, phô mai mozzarella và lá húng quế',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Giá món ăn',
    example: 12.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'ID danh mục menu',
    example: 'cat_123abc',
  })
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Danh mục menu',
  })
  @ValidateNested()
  @Type(() => MenuCategoryDto)
  @IsOptional()
  category?: MenuCategoryDto;

  @ApiPropertyOptional({
    description: 'Hình ảnh món ăn',
  })
  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  image?: ImageDto;

  @ApiPropertyOptional({
    description: 'ID hình ảnh món ăn',
    example: 'image_456def',
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
  position?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái có sẵn',
    example: true,
  })
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải món chay',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải món ăn pure chay (vegan)',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải không chứa gluten',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isGlutenFree?: boolean;

  @ApiPropertyOptional({
    description: 'Có phải món cay',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isSpicy?: boolean;

  @ApiPropertyOptional({
    description: 'Thời gian chuẩn bị (phút)',
    example: 15,
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
        quantity: 50,
        unit: 'g',
        isAllergen: false,
      },
      {
        ingredientName: 'Phô mai mozzarella',
        quantity: 100,
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
}

