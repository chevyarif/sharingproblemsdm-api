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

    // Fetch data from database
    const artikel = await this.prisma.pertanyaan.findMany({
      skip: skip,
      take: take,
      where: search
        ? {
            OR: [{ pertanyaan: { contains: lowerSearch } }],
          }
        : {},
    });

    // Count total records for pagination
    const totalPertanyaan = await this.prisma.pertanyaan.count({
      where: search
        ? {
            OR: [{ pertanyaan: { contains: lowerSearch } }],
          }
        : {},
    });

    // Apply masking to each record
    const maskedData = artikel.map((item) => {
      // Mask email
      const emailParts = item.email.split('@');
      const maskedEmail = emailParts[0].slice(0, 4) + 'xxx@' + emailParts[1];

      // Mask nama
      const maskedNama =
        item.nama.length > 5 ? item.nama.slice(0, 5) + '...' : item.nama;

      return {
        ...item,
        email: maskedEmail,
        nama: maskedNama,
      };
    });

    return {
      data: maskedData,
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
    const pertanyaan = await this.prisma.pertanyaan.findUnique({
      where: { id },
    });

    if (pertanyaan) {
      // Mask email
      const emailParts = pertanyaan.email.split('@');
      const maskedEmail = emailParts[0].slice(0, 4) + 'xxx@' + emailParts[1];

      // Mask nama
      const maskedNama =
        pertanyaan.nama.length > 5
          ? pertanyaan.nama.slice(0, 5) + '...'
          : pertanyaan.nama;

      // Return the masked data
      return {
        ...pertanyaan,
        email: maskedEmail,
        nama: maskedNama,
      };
    }

    return null;
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
