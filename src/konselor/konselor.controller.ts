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
  HttpException,
  HttpStatus,
  Search,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KonselorService } from './konselor.service';
import { CreateKonselorDto } from './dto/create-konselor.dto';

@Controller('konselor')
export class KonselorController {
  constructor(private readonly konselorService: KonselorService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateKonselorDto) {
    try {
      return await this.konselorService.createKonselor(body);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string, 
  ) {
    return this.konselorService.findAllKonselor(page, limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.konselorService.findKonselorById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.konselorService.updateKonselor(Number(id), body);
  }
}
