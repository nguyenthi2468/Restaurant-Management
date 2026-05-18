import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadImage(file: Express.Multer.File, options: { folder?: string }) {
    const uploadResult = await this.cloudinaryService.uploadFile(file);

    return this.prisma.imageAsset.create({
      data: {
        publicId: uploadResult.public_id,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
      },
    });
  }

  async createFromCloudinaryResp(resp: any, uploadedById?: string) {
    return this.prisma.imageAsset.create({
      data: {
        publicId: resp.public_id,
        url: resp.url,
        secureUrl: resp.secure_url,
      },
    });
  }
}
