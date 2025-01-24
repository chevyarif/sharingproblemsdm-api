import {
  IsEmail,
  IsString,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { tblkonselor_sex } from '@prisma/client'; 

export class CreateKonselorDto {
  @IsString()
  jabatan: string;

  @IsEmail({}, { message: 'Email tidak valid.' })
  @IsString()
  email: string;

  @IsString()
  @MaxLength(15, { message: 'Password maksimal 15 karakter.' }) 
  password: string;

  @IsEnum(tblkonselor_sex, { message: 'Jenis kelamin tidak valid.' })
  sex: tblkonselor_sex;

  @IsOptional()
  @IsString()
  pendidikan?: string;

  @IsOptional()
  @IsString()
  pengalaman?: string;
}
