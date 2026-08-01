import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

export interface JwtPayload {
    sub: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: (req: Request) => {
                let token = null;
                if (req && req.cookies) {
                token = req.cookies['token'];
                }
                return token;
            },
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: any) {
        const user = await this.userRepository.findOne({ where: { id: payload.sub } });
        if (!user || !user.activate) {
        throw new UnauthorizedException('User not found or inactive');
        }
        return user;
    }
}