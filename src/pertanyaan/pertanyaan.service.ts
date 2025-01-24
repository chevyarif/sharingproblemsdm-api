import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PertanyaanService {
  constructor(private readonly prisma: PrismaService) {}

  // Tambahkan pertanyaan baru
  async createPertanyaan(data: Prisma.PertanyaanCreateInput) {
    return this.prisma.pertanyaan.create({ data });
  }

  // Ambil semua pertanyaan
  async findAllPertanyaan(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const lowerSearch = search ? search.toLowerCase() : undefined;

    const artikel = await this.prisma.pertanyaan.findMany({
      skip: skip,
      take: take,
      where: search
        ? {
            OR: [{ pertanyaan: { contains: lowerSearch } }],
          }
        : {},
    });

    const totalPertanyaan = await this.prisma.pertanyaan.count({
      where: search
        ? {
            OR: [{ pertanyaan: { contains: lowerSearch } }],
          }
        : {},
    });

    return {
      data: artikel,
      pagination: {
        page: page,
        limit: limit,
        total: totalPertanyaan,
        totalPages: Math.ceil(totalPertanyaan / limit),
      },
    };
  }

  // Ambil pertanyaan berdasarkan ID
  async findPertanyaanById(id: number) {
    return this.prisma.pertanyaan.findUnique({ where: { id } });
  }

  // Update pertanyaan berdasarkan ID
  async updatePertanyaan(id: number, data: Prisma.NewsUpdateInput) {
    return this.prisma.pertanyaan.update({
      where: { id },
      data,
    });
  }

  // Hapus pertanyaan berdasarkan ID
  async deleteNews(id: number) {
    return this.prisma.news.delete({ where: { id } });
  }
}
