import { IsString, IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuCategoryDto } from './create-menu-category.dto';

export class UpdateMenuCategoryDto extends PartialType(CreateMenuCategoryDto) {}