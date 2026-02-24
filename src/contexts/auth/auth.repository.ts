import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserCredentialsEntity } from "./entities/user_credentials.entities";
import { Repository } from "typeorm";
import { count } from "console";
import { IAuthRepository } from "./auth.repository.interface";
import { UserProfileEntity } from "./entities/user_profile.entities";
@Injectable()
export class AuthRepository implements IAuthRepository{
    constructor(
        @InjectRepository(UserCredentialsEntity)
        private readonly credentialsRepository: Repository<UserCredentialsEntity>,
        @InjectRepository(UserProfileEntity)
        private readonly profileRepository: Repository<UserProfileEntity>,
    ) { }

    async findCredentialsByEmail(email: string) : Promise<UserCredentialsEntity | null> {
        const entity = await this.credentialsRepository.findOne({ where: { email } });
        
        return entity;
    }

    async saveCredentials(entity: UserCredentialsEntity): Promise<UserCredentialsEntity> {
        return this.credentialsRepository.save(entity);
    }

    async deleteCredentials(entity: UserCredentialsEntity): Promise<void> {
        await this.credentialsRepository.remove(entity);
    }

    async updateCredentials(entity: UserCredentialsEntity): Promise<UserCredentialsEntity> {
        return this.credentialsRepository.save(entity);
    }

    async findCredentialsById(id: string): Promise<UserCredentialsEntity | null> {
        const entity = await this.credentialsRepository.findOne({ where: { id } });
       
        return entity;
    }

    async createCredentials(entity: UserCredentialsEntity): Promise<UserCredentialsEntity> {
        return this.credentialsRepository.save(entity);
    }
    async checkEmailExists(email: string): Promise<boolean> {
        const count = await this.credentialsRepository.count({ where: { email } });
        return count > 0;
    }

    async createProfile(username: string, userCredentialsId: string, permissionsMask: string): Promise<UserProfileEntity> {
        const entity = new UserProfileEntity();
        entity.username = username;
        entity.userCredentialsId = userCredentialsId;
        entity.permissionsMask = permissionsMask;
        return this.profileRepository.save(entity);
    }

    async findProfileByCredentialsId(userCredentialsId: string): Promise<UserProfileEntity | null> {
        const entity = await this.profileRepository.findOne({ where: { userCredentialsId } });

        return entity;
    }

    async updateProfile(entity: UserProfileEntity): Promise<UserProfileEntity> {
        return this.profileRepository.save(entity);
    }

    async deleteProfile(entity: UserProfileEntity): Promise<void> {
        await this.profileRepository.remove(entity);
    }

    async findProfileByUsername(username: string): Promise<UserProfileEntity | null> {
        const entity = await this.profileRepository.findOne({ where: { username } });

        return entity;
    }
}