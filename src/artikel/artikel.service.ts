import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtikelService {
  constructor(private readonly prisma: PrismaService) {}

  // Tambahkan artikel baru
  async createArtikel(data: Prisma.ArtikelCreateInput) {
    return this.prisma.artikel.create({ data });
  }

  // Ambil semua artikel
  async findAllArtikel(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const lowerSearch = search ? search.toLowerCase() : undefined;

    const artikel = await this.prisma.artikel.findMany({
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

    const totalArtikel = await this.prisma.artikel.count({
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
      data: artikel,
      pagination: {
        page: page,
        limit: limit,
        total: totalArtikel,
        totalPages: Math.ceil(totalArtikel / limit),
      },
    };
  }

  // Ambil artikel berdasarkan ID
  async findArtikelById(id: number) {
    return this.prisma.artikel.findUnique({ where: { id } });
  }

  // Update artikel berdasarkan ID
  async updateArtikel(id: number, data: Prisma.ArtikelUpdateInput) {
    return this.prisma.artikel.update({
      where: { id },
      data,
    });
  }

  // Hapus artikel berdasarkan ID
  async deleteArtikel(id: number) {
    return this.prisma.artikel.delete({ where: { id } });
  }
}
