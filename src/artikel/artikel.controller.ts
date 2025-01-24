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
import { ArtikelService } from './artikel.service';

@Controller('artikel')
export class ArtikelController {
  constructor(private readonly artikelService: ArtikelService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body()
    body: {
      judul: string;
      isi: string;
      tgl: string;
    },
  ) {
    return this.artikelService.createArtikel(body);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.artikelService.findAllArtikel(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artikelService.findArtikelById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.artikelService.updateArtikel(Number(id), body);
  }
}
