import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PertanyaanService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  async createPertanyaan(data: Prisma.PertanyaanCreateInput) {
    return this.prisma.pertanyaan.create({ data });
  }

  // ----------------------------------------------------------------
  async findAllPertanyaan(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const take = Number(limit);
    const lowerSearch = search ? search.toLowerCase() : undefined;

    // Fetch data from database
    const artikel = await this.prisma.pertanyaan.findMany({
      skip: skip,
      take: take,
      where: {
        AND: [
          { publish: 1 },
          search
            ? {
                OR: [{ pertanyaan: { contains: lowerSearch } }],
              }
            : {},
        ],
      },
      include: {
        kategori: true,
        admin: {
          select: {
            fullname: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Count total records for pagination
    const totalPertanyaan = await this.prisma.pertanyaan.count({
      where: {
        AND: [
          { publish: 1 }, // Filter for publish = 1
          search
            ? {
                OR: [{ pertanyaan: { contains: lowerSearch } }],
              }
            : {},
        ],
      },
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
        kategori_id: undefined,
        kategori: item.kategori?.nama_kategori,
        publish: undefined,
        admin_fullname: item.admin?.fullname,
        id_admin: undefined,
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

  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  async updatePertanyaan(id: number, data: Prisma.NewsUpdateInput) {
    return this.prisma.pertanyaan.update({
      where: { id },
      data,
    });
  }

  // ----------------------------------------------------------------
  async deletePertanyaan(id: number) {
    return this.prisma.pertanyaan.delete({ where: { id } });
  }
}
