import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateKonselorDto } from './dto/create-konselor.dto';
import { error } from 'console';

@Injectable()
export class KonselorService {
  constructor(private readonly prisma: PrismaService) {}

  // fungsi untuk memastikan email unik
  async checkEmailUnik(email: string): Promise<boolean> {
    const existingEmail = await this.prisma.konselor.findUnique({
      where: { email },
    });
    return !existingEmail;
  }

  // Tambahkan Konselor baru
  async createKonselor(data: CreateKonselorDto) {
    //Cek apa email sudah ada
    const emailUnik = await this.checkEmailUnik(data.email);
    if (!emailUnik) {
      throw new Error('Email sudah digunakan.');
    }
    return this.prisma.konselor.create({
      data: {
        jabatan: data.jabatan,
        email: data.email,
        password: data.password,
        sex: data.sex,
        pendidikan: data.pendidikan,
        pengalaman: data.pengalaman,
      },
    });
  }

  // Ambil semua Konselor
  async findAllKonselor(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    // Jika ada parameter pencarian, ubah ke huruf kecil
    const lowerSearch = search ? search.toLowerCase() : undefined;

    const konselor = await this.prisma.konselor.findMany({
      skip: skip,
      take: take,
      where: search
        ? {
            OR: [
              { jabatan: { contains: lowerSearch } },
              { email: { contains: lowerSearch } },
              { alamat: { contains: lowerSearch } },
              { pengalaman: { contains: lowerSearch } },
            ],
          }
        : {},
    });
  
    const totalKonselor = await this.prisma.konselor.count({
      where: search
        ? {
            OR: [
              { jabatan: { contains: lowerSearch } },
              { email: { contains: lowerSearch } },
              { alamat: { contains: lowerSearch } },
              { pengalaman: { contains: lowerSearch } },
            ],
          }
        : {},
    });
  
    return {
      data: konselor,
      pagination: {
        page: page,
        limit: limit,
        total: totalKonselor,
        totalPages: Math.ceil(totalKonselor / limit),
      },
    };
  }

  // Ambil Konselor berdasarkan ID
  async findKonselorById(id: number) {
    return this.prisma.konselor.findUnique({ where: { id } });
  }

  // Update Konselor berdasarkan ID
  async updateKonselor(id: number, data: Prisma.NewsUpdateInput) {
    return this.prisma.konselor.update({
      where: { id },
      data,
    });
  }

  // Hapus Konselor berdasarkan ID
  async deleteKonselor(id: number) {
    return this.prisma.konselor.delete({ where: { id } });
  }
}
