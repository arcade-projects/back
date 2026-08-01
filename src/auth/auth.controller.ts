import { Body, Controller, Post, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body('email') email: string, 
    @Body('otp') otp: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const token = await this.authService.verifyOtp(email, otp);

    response.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: isProduction ? '.dequizma.com' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      user: { email },
      message: 'login successful',
    };
  }
}