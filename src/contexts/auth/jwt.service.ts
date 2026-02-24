import { Injectable } from "@nestjs/common";
import { JWTServiceInterface } from "./interface/jwt.interface";
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JWTService implements JWTServiceInterface{
    async generateToken(payload: object, expiresIn?: jwt.SignOptions['expiresIn']): Promise<string> {
        const secret: jwt.Secret = 'your-secret-key';
        const options: jwt.SignOptions = { expiresIn: expiresIn ?? '1h' };
        return jwt.sign(payload, secret, options);
    }

    async verifyToken(token: string): Promise<object | null> {
        try {
            const secret: jwt.Secret = 'your-secret-key';
            return jwt.verify(token, secret) as object;
        } catch (error) {
            return null;
        }
    }
}