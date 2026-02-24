export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
export interface PasswordHasherInterface {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}