import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}
  
  // Tambahkan Pages baru
  async createPages(data: Prisma.PagesCreateInput) {
    return this.prisma.pages.create({ data });
  }

  // Ambil semua Pages
  async findAllPages() {
    return this.prisma.pages.findMany();
  }

  // Ambil Pages berdasarkan ID
  async findPagesById(id: number) {
    return this.prisma.pages.findUnique({ where: { id } });
  }

  // Update Pages berdasarkan ID
  async updatePages(id: number, data: Prisma.PagesUpdateInput) {
    return this.prisma.pages.update({
      where: { id },
      data,
    });
  }

  // Hapus Pages berdasarkan ID
  async deletePages(id: number) {
    return this.prisma.pages.delete({ where: { id } });
  }

}
