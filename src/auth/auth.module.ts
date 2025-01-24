// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET, // Pastikan secret diambil dari file .env
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // Waktu kedaluwarsa token
    }),
  ],
  providers: [JwtStrategy, PrismaService, AuthService, JwtAuthGuard], // Menambahkan JwtAuthGuard ke provider
  exports: [JwtAuthGuard], // Menyediakan JwtAuthGuard untuk digunakan di modul lain
})
export class AuthModule {}
