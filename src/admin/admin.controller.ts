import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AdminService } from './admin.service';
import { tbladmin_role } from '@prisma/client'; 
import { tbladmin_status } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(
  //   @Body()
  //   body: {
  //     username: string;
  //     fullname: string;
  //     password: string;
  //     email: string;
  //     role: tbladmin_role;
  //     status: tbladmin_status;
  //   },
  // ) {
  //   return this.adminService.createAdmin(body);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.adminService.findAllAdmins();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findAdminById(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateAdmin(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.deleteAdmin(Number(id));
  }

}
