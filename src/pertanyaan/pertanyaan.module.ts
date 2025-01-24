import { Module } from '@nestjs/common';
import { PertanyaanController } from './pertanyaan.controller';
import { PertanyaanService } from './pertanyaan.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PertanyaanController],
  providers: [PertanyaanService],
})
export class PertanyaanModule {}
