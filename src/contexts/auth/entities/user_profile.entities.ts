import { IsString } from "class-validator";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserCredentialsEntity } from "./user_credentials.entities";

@Entity("user_profile") 
export class UserProfileEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 100 })
    username: string;

    @Column({ type: "text", nullable: true })
    bio: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    avatarUrl: string;

    @Column({ name: "permissions_mask", type: "varchar", length: 64, default: '0' })
    permissionsMask: string;

    @Index({ unique: true })
    @Column({ name: "user_credentials_id", type: "uuid", select: false })
    userCredentialsId: string;
}