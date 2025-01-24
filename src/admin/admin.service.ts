import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
  
  // Tambahkan Admin baru
  async createAdmin(data: Prisma.AdminCreateInput) {
    return this.prisma.admin.create({ data });
  }

  // Ambil semua Admin
  async findAllAdmins() {
    return this.prisma.admin.findMany();
  }

  // Ambil Admin berdasarkan ID
  async findAdminById(id: number) {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  // Update Admin berdasarkan ID
  async updateAdmin(id: number, data: Prisma.AdminUpdateInput) {
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  // Hapus Admin berdasarkan ID
  async deleteAdmin(id: number) {
    return this.prisma.admin.delete({ where: { id } });
  }
}
