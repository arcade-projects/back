import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('send-otp')
    async sendOtp(@Body('email') email: string) {
        return this.authService.sendOtp(email);
    }

    @Post('verify-otp')
    async verifyOtp(
        @Body() dto: VerifyOtpDto,
        @Res({ passthrough: true }) res: Response        
    ) {

        const result = await this.authService.verifyOtp(dto.email, dto.otp);

        res.cookie('token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: '.dequizma.com',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return this.authService.verifyOtp(dto.email, dto.otp);
    }
}
