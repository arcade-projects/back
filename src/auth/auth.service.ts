import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User> ,
        private jwstService: JwtService,
        private readonly redisService: RedisService,
        private readonly mailerService: MailerService,
    ) {}

    async sendOtp(email: string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.redisService.client.set(`otp:${email}`, otp, 'EX', 120);

        await this.mailerService.sendMail({
            to: email,
            subject: 'Enter to the Arcade by Verify CODE',
            text: `Your verify CODE: ${otp}`,
            html: `<b>Your verify CODE: ${otp}</b>`
        });

        return { message: 'The code has been send.' }
    }

    async verifyOtp(email: string, otp: string) {
        const savedOtp = await this.redisService.client.get(`otp:${email}`);

        if (!savedOtp || savedOtp !== otp) {
            throw new UnauthorizedException('wrong or expired!');
        }

        await this.redisService.client.del(`otp:${email}`);

        let user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            user = this.userRepository.create({ email, email_verified: true });
            await this.userRepository.save(user);
        }

        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwstService.sign(payload);

        return accessToken;
    }
}
