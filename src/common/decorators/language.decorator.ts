import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Language = createParamDecorator(
    (defaultLanguage: string = 'en', ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const lang =
            request.headers['accept-language'] ||
            request.headers['x-lang'] ||
            defaultLanguage;

        return lang.split(',')[0].split('-')[0];
    },
);