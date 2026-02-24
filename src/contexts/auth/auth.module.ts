import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCredentialsEntity } from "./entities/user_credentials.entities";
import { AUTH_REPOSITORY } from "./auth.repository.interface";
import { AuthRepository } from "./auth.repository";
import { PASSWORD_HASHER } from "./interface/password-hasher.interface";
import { PasswordHasherService } from "./password-hasher.service";
import { JWT_SERVICE } from "./interface/jwt.interface";
import { JWTService } from "./jwt.service";
import { UserProfileEntity } from "./entities/user_profile.entities";
import { SendUserRegisteredEventHandler } from "./handler/send-user-registered.handler";
import { JwtAuthGuard } from "../conversation/guards/conversation.guard";

@Module({
    imports: [TypeOrmModule.forFeature([
        UserCredentialsEntity, UserProfileEntity
    ])],
    controllers: [AuthController],
    providers: [AuthService, 
        SendUserRegisteredEventHandler,
        {provide: AUTH_REPOSITORY, useClass: AuthRepository},
        {provide: PASSWORD_HASHER, useClass: PasswordHasherService},
        {provide: JWT_SERVICE, useClass: JWTService},
        JWTService,
        JwtAuthGuard,
    ],
    exports: [AuthService],
})
export class AuthModule {}