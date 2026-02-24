import { UserCredentialsEntity } from "src/contexts/auth/entities/user_credentials.entities";
import { UserProfileEntity } from "src/contexts/auth/entities/user_profile.entities";
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
@Entity("conversation")
export class ConversationEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: true })
    userId: string;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @ManyToMany(() => UserProfileEntity)
    @JoinTable({
        name: "conversation_participants",
        joinColumn: { name: "conversation_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
    })
    participants: UserCredentialsEntity[];
}

