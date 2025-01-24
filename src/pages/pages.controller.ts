import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body()
    body: {
      judul: string;
      isi: string;
    },
  ) {
    return this.pagesService.createPages(body);
  }

  @Get()
  findAll() {
    return this.pagesService.findAllPages();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findPagesById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.pagesService.updatePages(Number(id), body);
  }

}
