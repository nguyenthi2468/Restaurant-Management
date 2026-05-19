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
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IngredientDto {
  @ApiProperty({
    description: 'Tên nguyên liệu',
    example: 'Sốt cà chua',
  })
  @IsString()
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

  constructor(partial: Partial<IngredientDto>) {
    Object.assign(this, partial);
  }
}

export class OptionValueDto {
  @ApiProperty({
    description: 'Tên giá trị',
    example: 'Nhỏ',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả giá trị',
    example: 'Pizza kích thước nhỏ',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Số tiền điều chỉnh giá',
    example: 0,
  })
  @IsDecimal()
  priceAdjustment: number;

  constructor(partial: Partial<OptionValueDto>) {
    Object.assign(this, partial);
  }
}

export class OptionDto {
  @ApiProperty({
    description: 'Tên tùy chọn',
    example: 'Kích thước',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả tùy chọn',
    example: 'Chọn kích thước pizza',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Nhóm tùy chọn',
    example: 'Size',
  })
  @IsString()
  @IsOptional()
  group?: string;

  @ApiPropertyOptional({
    description: 'Có phải tùy chọn bắt buộc',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @ApiProperty({
    description: 'Danh sách giá trị của tùy chọn',
    example: [
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
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionValueDto)
  values: OptionValueDto[];

  constructor(partial: Partial<OptionDto>) {
    Object.assign(this, partial);
  }
}

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Tên món ăn',
    example: 'Pizza Margherita',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Mô tả món ăn',
    example: 'Pizza truyền thống với sốt cà chua, phô mai mozzarella và lá húng quế',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Giá món ăn',
    example: 12.99,
    minimum: 0,
  })
  @IsDecimal()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'ID danh mục menu',
    example: 'cat_123abc',
  })
  @IsString()
  categoryId: string;

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
  @IsOptional()
  position?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái có sẵn',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
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

  constructor(partial: Partial<CreateMenuItemDto>) {
    Object.assign(this, partial);
  }
}