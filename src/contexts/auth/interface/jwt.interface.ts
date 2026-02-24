import { SignOptions } from 'jsonwebtoken';

export const JWT_SERVICE = Symbol('JWT_SERVICE');

export interface JWTServiceInterface {
    generateToken(payload: object, expiresIn?: SignOptions['expiresIn']): Promise<string>;
    verifyToken(token: string): Promise<object | null>;
}