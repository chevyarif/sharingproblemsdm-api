import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(
    @Body()
    body: {
      username: string;
      adminNama: string;
      password: string;
      email: string;
    },
  ) {
    return this.adminService.createAdmin(body);
  }

  @Get()
  findAll() {
    return this.adminService.findAllAdmins();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findAdminById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateAdmin(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.deleteAdmin(Number(id));
  }
}
