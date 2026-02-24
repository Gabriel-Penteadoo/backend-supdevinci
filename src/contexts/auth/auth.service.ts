import { Injectable, Inject, ExecutionContext } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from './auth.repository.interface';
import { UserCredentialsEntity } from './entities/user_credentials.entities';
import { LoginDTO, RegisterDTO } from './types/auth.dto';
import { PASSWORD_HASHER} from './interface/password-hasher.interface';
import { PasswordHasherService } from './password-hasher.service';
import * as jwt from 'jsonwebtoken';
import { JWT_SERVICE, JWTServiceInterface } from './interface/jwt.interface';
import { JWTService } from './jwt.service';
import { DomainError } from 'src/core/errors/domain-error';
import { EmailAlreadyInUseError, InvalidCredentialsError, InvalidPasswordError, InvalidPermissionMaskError, InvalidRoleError, UserNotFoundError } from './errors/auth.errors';
import { EVENT_BUS, EventBusPort } from 'src/core/events/event-bus.port';
import { UserRegisteredEvent } from './events/user-registered.event';
import { addPermission, removePermission, Roles, toMask, togglePermission } from './types/permission.types';
import { SetUserRoleDTO, UpdateUserPermissionDTO } from './types/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasherService,
    @Inject(JWT_SERVICE) private readonly jwtService: JWTService,
    @Inject(EVENT_BUS) private readonly eventBus: EventBusPort
  ) {}

  async register (dto : RegisterDTO): Promise<boolean | string> {
    const emailExists =  await this.authRepository.checkEmailExists(dto.email);
    if (emailExists) {
      throw new EmailAlreadyInUseError({
        fields: {
          email: [dto.email]
        }
      });
    }
    const hashedPassword = await this.passwordHasher.hash(dto.password);
    const userCredentials = new UserCredentialsEntity();
    userCredentials.email = dto.email;
    userCredentials.passwordHash = hashedPassword;
    await this.authRepository.createCredentials(userCredentials);

    const defaultPermissionsMask = Roles.USER.toString();
    const userProfile = await this.authRepository.createProfile(dto.username, userCredentials.id, defaultPermissionsMask);
    await this.eventBus.publish(UserRegisteredEvent.create({
      userId: userCredentials.id,
      username: dto.username,
      email: dto.email
    }));
    return userProfile;
  }

  async login (dto: LoginDTO): Promise<object | null> {
    const userCredentials = await this.authRepository.findCredentialsByEmail(dto.email);
    if (!userCredentials) {
      throw new InvalidCredentialsError({
        fields: {
          email: [dto.email]
        }
      });
    }

    if (!await this.passwordHasher.compare(dto.password, userCredentials.passwordHash)) {
      throw new InvalidPasswordError({
        fields: {
          password: []
        }
      });
    }

    const userProfile = await this.authRepository.findProfileByCredentialsId(userCredentials.id);
    const permissionsMask = userProfile?.permissionsMask ?? Roles.USER.toString();

    const tokenPayload = {
      userCredentials: {
        id: userCredentials.id,
        email: userCredentials.email,
      },
      permissionsMask,
    };

    const acces_token = await this.jwtService.generateToken(tokenPayload);
    const refresh_token = await this.jwtService.generateToken(tokenPayload, '7d');

    return { acces_token, refresh_token };
  }

  async getProfile(id: string): Promise<any> {

    const profile = await this.authRepository.findProfileByCredentialsId(id);
    if (!profile) {
      throw new UserNotFoundError({
        fields: {
          id: [id]
        }
      });
    }
    return profile;
  }

  async grantPermission(dto: UpdateUserPermissionDTO): Promise<{ userCredentialsId: string; permissionsMask: string }> {
    const profile = await this.findProfileOrThrow(dto.userCredentialsId);
    const currentMask = toMask(profile.permissionsMask);
    const permission = this.parsePermission(dto.permission);
    profile.permissionsMask = addPermission(currentMask, permission).toString();
    await this.authRepository.updateProfile(profile);

    return {
      userCredentialsId: dto.userCredentialsId,
      permissionsMask: profile.permissionsMask,
    };
  }

  async revokePermission(dto: UpdateUserPermissionDTO): Promise<{ userCredentialsId: string; permissionsMask: string }> {
    const profile = await this.findProfileOrThrow(dto.userCredentialsId);
    const currentMask = toMask(profile.permissionsMask);
    const permission = this.parsePermission(dto.permission);
    profile.permissionsMask = removePermission(currentMask, permission).toString();
    await this.authRepository.updateProfile(profile);

    return {
      userCredentialsId: dto.userCredentialsId,
      permissionsMask: profile.permissionsMask,
    };
  }

  async togglePermission(dto: UpdateUserPermissionDTO): Promise<{ userCredentialsId: string; permissionsMask: string }> {
    const profile = await this.findProfileOrThrow(dto.userCredentialsId);
    const currentMask = toMask(profile.permissionsMask);
    const permission = this.parsePermission(dto.permission);
    profile.permissionsMask = togglePermission(currentMask, permission).toString();
    await this.authRepository.updateProfile(profile);

    return {
      userCredentialsId: dto.userCredentialsId,
      permissionsMask: profile.permissionsMask,
    };
  }

  async setRole(dto: SetUserRoleDTO): Promise<{ userCredentialsId: string; permissionsMask: string; role: string }> {
    const profile = await this.findProfileOrThrow(dto.userCredentialsId);
    const roleMask = Roles[dto.role];

    if (roleMask === undefined) {
      throw new InvalidRoleError({
        fields: {
          role: [dto.role],
        },
      });
    }

    profile.permissionsMask = roleMask.toString();
    await this.authRepository.updateProfile(profile);

    return {
      userCredentialsId: dto.userCredentialsId,
      permissionsMask: profile.permissionsMask,
      role: dto.role,
    };
  }

  private async findProfileOrThrow(userCredentialsId: string): Promise<any> {
    const profile = await this.authRepository.findProfileByCredentialsId(userCredentialsId);

    if (!profile) {
      throw new UserNotFoundError({
        fields: {
          userCredentialsId: [userCredentialsId],
        },
      });
    }

    return profile;
  }

  private parsePermission(permission: string): bigint {
    try {
      return BigInt(permission);
    } catch {
      throw new InvalidPermissionMaskError({
        fields: {
          permission: [permission],
        },
      });
    }
  }
 
}


