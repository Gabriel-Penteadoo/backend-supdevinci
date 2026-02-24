import { Injectable } from "@nestjs/common";
import { PasswordHasherInterface } from "./interface/password-hasher.interface";
import * as bcrypt from 'bcrypt';
@Injectable()
export class PasswordHasherService implements PasswordHasherInterface{
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}