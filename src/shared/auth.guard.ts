import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request.headers.authorization) return false
        request.user = await this.validateToken(request.headers.authorization)
        return true
    }


    private async validateToken(auth: string) {
        const splited_token = auth.split(' ')

        if (splited_token[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.FORBIDDEN)
        }

        try {
            const decoded = jwt.verify(splited_token[1], process.env.SECRET)
            return decoded
        } catch (err) {
            const message = 'Token error: ' + (err.message || err.name)
            throw new HttpException(message, HttpStatus.FORBIDDEN)
        }

    }

}