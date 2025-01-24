import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  username: string;
  fullname: string;
  email: string;
  password: string;
}
