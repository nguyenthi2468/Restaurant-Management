import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDecimal,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @Min(0)
  price: number;

  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  imageId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsBoolean()
  @IsOptional()
  isVegetarian?: boolean;

  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @IsBoolean()
  @IsOptional()
  isGlutenFree?: boolean;

  @IsBoolean()
  @IsOptional()
  isSpicy?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  preparationTime?: number;

  @IsArray()
  @IsOptional()
  ingredients?: {
    ingredientName: string;
    quantity: number;
    unit: string;
    isAllergen?: boolean;
  }[];

  @IsArray()
  @IsOptional()
  options?: {
    name: string;
    description?: string;
    group?: string;
    isRequired?: boolean;
    values: {
      name: string;
      description?: string;
      priceAdjustment: number;
    }[];
  }[];
}
