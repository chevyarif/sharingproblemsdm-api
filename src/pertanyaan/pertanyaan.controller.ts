import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Search,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PertanyaanService } from './pertanyaan.service';

@Controller('pertanyaan')
export class PertanyaanController {
  constructor(private readonly pertanyaanService: PertanyaanService) {}

  @Post()
  create(
    @Body()
    body: {
      nama: string;
      email: string;
      pertanyaan: string;
      tgl: string;
    },
  ) {
    return this.pertanyaanService.createPertanyaan(body);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.pertanyaanService.findAllPertanyaan(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pertanyaanService.findPertanyaanById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.pertanyaanService.updatePertanyaan(Number(id), body);
  }
}
