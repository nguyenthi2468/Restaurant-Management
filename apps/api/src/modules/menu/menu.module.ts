import { Module } from '@nestjs/common';
import { MenuCategoryController } from './menu-category.controller';
import { MenuCategoryService } from './menu-category.service';
import { MenuItemController } from './menu-item.controller';
import { MenuItemService } from './menu-item.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [PrismaModule, CloudinaryModule, ImageModule],
  controllers: [MenuCategoryController, MenuItemController],
  providers: [MenuCategoryService, MenuItemService],
})
export class MenuModule {}
