import { IsEmail, IsIn, IsString, IsStrongPassword, IsUUID } from "class-validator"

export class LoginDTO {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
}

export class RegisterDTO {
    @IsEmail()
    email: string
    @IsStrongPassword()
    password: string
    @IsString()
    username: string
}

export class UpdateUserPermissionDTO {
    @IsUUID()
    userCredentialsId: string

    @IsString()
    permission: string
}

export class SetUserRoleDTO {
    @IsUUID()
    userCredentialsId: string

    @IsIn(['USER', 'MODERATOR', 'ADMIN'])
    role: 'USER' | 'MODERATOR' | 'ADMIN'
}