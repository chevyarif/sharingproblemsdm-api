import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { PagesModule } from './pages/pages.module';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { KonselorModule } from './konselor/konselor.module';
import { ArtikelModule } from './artikel/artikel.module';
import { PertanyaanModule } from './pertanyaan/pertanyaan.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AdminModule,
    PagesModule,
    NewsModule,
    AuthModule,
    KonselorModule,
    ArtikelModule,
    PertanyaanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
