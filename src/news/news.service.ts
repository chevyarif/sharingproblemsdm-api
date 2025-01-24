import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Tambahkan News baru
  async createNews(data: Prisma.NewsCreateInput) {
    return this.prisma.news.create({ data });
  }

  // Ambil semua News
  async findAllNews(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const take = Number(limit); 

    const lowerSearch = search ? search.toLowerCase() : undefined;

    const news = await this.prisma.news.findMany({
      skip: skip,
      take: take,
      where: search
        ? {
            OR: [
              { judul: { contains: lowerSearch } },
              { isi: { contains: lowerSearch } },
            ],
          }
        : {},
    });

    const totalNews = await this.prisma.news.count({
      where: search
        ? {
            OR: [
              { judul: { contains: lowerSearch } },
              { isi: { contains: lowerSearch } },
            ],
          }
        : {},
    });

    return {
      data: news,
      pagination: {
        page: page,
        limit: limit,
        total: totalNews,
        totalPages: Math.ceil(totalNews / limit),
      },
    };
  }

  // Ambil News berdasarkan ID
  async findNewsById(id: number) {
    return this.prisma.news.findUnique({ where: { id } });
  }

  // Update News berdasarkan ID
  async updateNews(id: number, data: Prisma.NewsUpdateInput) {
    return this.prisma.news.update({
      where: { id },
      data,
    });
  }

  // Hapus News berdasarkan ID
  async deleteNews(id: number) {
    return this.prisma.news.delete({ where: { id } });
  }
}
