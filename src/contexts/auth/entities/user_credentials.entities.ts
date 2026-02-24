import { Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserProfileEntity } from "./user_profile.entities";

@Entity("user_credentials")
export class UserCredentialsEntity {
    // Define columns and properties for user credentials entity
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "password_hash", type: "varchar", length: 255 })
    passwordHash: string;

    @Index({ unique: true })
    @Column({name: "email", type: "varchar", length: 255})
    email: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}

