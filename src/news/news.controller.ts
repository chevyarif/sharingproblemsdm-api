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
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

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
    return this.newsService.createNews(body);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string, 
  ) {
    return this.newsService.findAllNews(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findNewsById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.newsService.updateNews(Number(id), body);
  }
}
