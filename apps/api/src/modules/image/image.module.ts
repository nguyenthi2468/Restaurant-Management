import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
