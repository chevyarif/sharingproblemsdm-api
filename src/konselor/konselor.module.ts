import { Module } from '@nestjs/common';
import { KonselorService } from './konselor.service';
import { KonselorController } from './konselor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [KonselorService],
  controllers: [KonselorController]
})
export class KonselorModule {}
