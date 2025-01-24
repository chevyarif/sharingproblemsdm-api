import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ----------------------------------------------------------------
  async createUSer(body: any) {
    const { username, fullname, email, password } = body;

    // check if email is exists
    const existingUser = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await this.prisma.admin.create({
      data: {
        username,
        fullname,
        email,
        password: hashedPassword,
        role: 'USER',
        status: 'inactive',
      },
    });

    // generate activation token
    const activationToken = await this.jwtService.sign(
      { userId: newUser.id },
      { expiresIn: '1h' },
    );

    // send activation email
    const activationLink = `${process.env.FRONTEND_URL}/activate?token=${activationToken}`;
    await this.sendActivationEmail(email, activationLink);
    return {
      message:
        'Registration successful. Please check your email to activate your account.',
    };
  }

  // ----------------------------------------------------------------
  async sendActivationEmail(email: string, activationLink: string) {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      // host: process.env.EMAIL_SMTP,
      // port: process.env.EMAIL_PORT,
      // secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account Activation',
      html: `<p>Hi,</p>
        <p>Please click the link below to activate your account:</p>
        <a href="${activationLink}">${activationLink}</a>
        <p>This link will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);
  }

  // ----------------------------------------------------------------
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.admin.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // ----------------------------------------------------------------
  async activateUser(token: string) {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Verifikasi token
      const payload = this.jwtService.verify(token);

      // Log untuk debugging
      console.log('Payload token:', payload);

      // Periksa apakah user ada di database
      const user = await this.prisma.admin.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.status === 'active') {
        return { message: 'Account is already activated' };
      }

      // Update status user menjadi aktif
      await this.prisma.admin.update({
        where: { id: payload.userId },
        data: { status: 'active' },
      });

      return { message: 'Account activated successfully!' };
    } catch (error) {
      // Log error untuk debugging
      console.error('Activation error:', error);

      throw new HttpException(
        error.message || 'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // ----------------------------------------------------------------
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user_info: {
        id: user.id,
        username: user.username,
        nama: user.fullname,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ----------------------------------------------------------------
  async getUserFromToken(token: string): Promise<any> {
    try {
      // Verifikasi token
      const decoded = this.jwtService.verify(token);

      // Ambil pengguna dari database berdasarkan ID (atau data lain yang ada di token)
      const user = await this.prisma.admin.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Hilangkan password sebelum mengembalikan data
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // ----------------------------------------------------------------
  async forgotPassword(email: string) {
    // Periksa apakah email terdaftar
    const user = await this.prisma.admin.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Email not found');
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    // Simpan token ke tabel password_resets
    await this.prisma.password_resets.create({
      data: {
        user_id: user.id,
        reset_token: resetToken,
        expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      },
    });

    // Kirim email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Hi ${user.fullname},</p>
           <p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>
           <p>This link will expire in 1 hour.</p>`,
    };

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_SMTP,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail(mailOptions);
  }

  // ----------------------------------------------------------------
  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    try {
      // Verifikasi token
      const payload = this.jwtService.verify(token);

      // Cari token di tabel `password_resets`
      const resetRecord = await this.prisma.password_resets.findFirst({
        where: { reset_token: token },
      });

      if (!resetRecord || resetRecord.expires_at < new Date()) {
        throw new Error('Invalid or expired token');
      }

      // Update password pengguna
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.admin.update({
        where: { id: payload.userId },
        data: { password: hashedPassword },
      });

      // Hapus record token setelah digunakan
      await this.prisma.password_resets.delete({
        where: { id: resetRecord.id },
      });

      // Kirim email konfirmasi
      const user = await this.prisma.admin.findUnique({
        where: { id: payload.userId },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Successful',
        html: `<p>Hi ${user.fullname},</p>
               <p>Your password has been reset successfully.</p>`,
      };

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: process.env.EMAIL_SMTP,
        port: parseInt(process.env.EMAIL_PORT, 10),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(error.message || 'Error resetting password');
    }
  }
}
