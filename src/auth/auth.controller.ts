import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { Response } from 'express';

// @UseGuards(JwtAuthGuard)
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
        const token = await this.authService.verifyOtp(dto.email, dto.otp);

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            domain: isProduction ? '.dequizma.com' : undefined,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        return { 
            message: 'ورود با موفقیت انجام شد',
        };
    }
}
