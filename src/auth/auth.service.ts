import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly mailerService: MailerService,
    ) {}

    async sendOtp(email: string) {
        if (!email || typeof email !== 'string' || !email.trim()) {
            throw new BadRequestException('آدرس ایمیل وارد شده معتبر نیست');
        }

        const cleanEmail = email.trim().toLowerCase();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.redisService.client.set(`otp:${cleanEmail}`, otp, 'EX', 120);

        await this.mailerService.sendMail({
            to: cleanEmail,
            subject: 'Enter to the Arcade by Verify CODE',
            text: `Your verify CODE: ${otp}`,
            html: `<b>Your verify CODE: ${otp}</b>`
        });

        return { message: 'The code has been sent.' };
    }

    async verifyOtp(email: string, otp: string) {
        if (!email || !otp) {
            throw new BadRequestException('Email and OTP are required');
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanOtp = otp.trim();

        const savedOtp = await this.redisService.client.get(`otp:${cleanEmail}`);

        if (!savedOtp || savedOtp !== cleanOtp) {
            throw new UnauthorizedException('wrong or expired!');
        }

        await this.redisService.client.del(`otp:${cleanEmail}`);

        let user = await this.userRepository.findOne({ where: { email: cleanEmail } });

        if (!user) {
            user = this.userRepository.create({ 
                email: cleanEmail, 
                email_verified: true,
                last_login_at: new Date(),
            });
        } else {
            user.email_verified = true;
            user.last_login_at = new Date();
        }

        await this.userRepository.save(user);

        const payload = { sub: user.id, email: user.email };

        return this.jwtService.sign(payload);
    }
}