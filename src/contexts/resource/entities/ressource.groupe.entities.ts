import { UserCredentialsEntity } from "../../auth/entities/user_credentials.entities";
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("resource_groupe")
export class RscGroupeEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", nullable: true })
    name: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @ManyToMany(() => UserCredentialsEntity)
    @JoinTable({
        name: "conversation_groupe_participants",
        joinColumn: { name: "conversation_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
    })
    participants: UserCredentialsEntity[];
}

