import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, NewsStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto, NewsStatusDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ListNewsDto } from './dto/list-news.dto';

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  private mapStatus(s?: NewsStatusDto): NewsStatus | undefined {
    if (!s) return undefined;
    return s as unknown as NewsStatus;
  }

  async create(userId: string, dto: CreateNewsDto) {
    const status = this.mapStatus(dto.status) ?? NewsStatus.DRAFT;

    const baseSlug = slugify(dto.title);
    let slug = baseSlug || `news-${Date.now()}`;
    const existed = await this.prisma.news.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existed) slug = `${slug}-${Date.now()}`;

    const data: Prisma.NewsCreateInput = {
      title: dto.title,
      summary: dto.summary,
      content: dto.content,
      slug,
      status,
      publishedAt: status === NewsStatus.PUBLISHED ? new Date() : null,
      createdBy: {
        connect: { id: userId },
      },
    };

    if (dto.imageId) {
      data.image = {
        connect: { id: dto.imageId },
      };
    }

    return this.prisma.news.create({
      data,
      include: {
        image: true,
        createdBy: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async list(q: ListNewsDto, isAdmin = false) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NewsWhereInput = {
      deletedAt: null,
      ...(q.q
        ? {
            OR: [
              { title: { contains: q.q, mode: 'insensitive' } },
              { summary: { contains: q.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(q.status ? { status: this.mapStatus(q.status) } : {}),
    };

    // Nếu là public list: chỉ show PUBLISHED
    if (!isAdmin) where.status = NewsStatus.PUBLISHED;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: { image: true },
      }),
      this.prisma.news.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async getById(id: string, isAdmin = false) {
    const news = await this.prisma.news.findFirst({
      where: {
        id,
        deletedAt: null,
        ...(isAdmin ? {} : { status: NewsStatus.PUBLISHED }),
      },
      include: { image: true },
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async getBySlug(slug: string, isAdmin = false) {
    const news = await this.prisma.news.findFirst({
      where: {
        slug,
        deletedAt: null,
        ...(isAdmin ? {} : { status: NewsStatus.PUBLISHED }),
      },
      include: { image: true },
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async update(userId: string, id: string, dto: UpdateNewsDto) {
    const current = await this.prisma.news.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!current) throw new NotFoundException('News not found');

    const status = this.mapStatus(dto.status);

    const data: Prisma.NewsUpdateInput = {
      title: dto.title,
      summary: dto.summary,
      content: dto.content,
      ...(status
        ? {
            status,
            publishedAt: status === NewsStatus.PUBLISHED ? new Date() : null,
          }
        : {}),
    };

    return this.prisma.$transaction(async (tx) => {

      return tx.news.update({
        where: { id },
        data,
        include: { image: true },
      });
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.news.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('News not found');

    return this.prisma.news.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
