import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { UserCredentialsEntity } from "../../auth/entities/user_credentials.entities";
import { ConversationEntity } from "../../conversation/entities/conversation.entities";

@Entity("message")
export class MessageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "text" })
    content: string;

    @ManyToOne(() => UserCredentialsEntity)
    @JoinColumn({ name: "sender_id" })
    sender: UserCredentialsEntity;

    @Column()
    senderId: string;


    @ManyToOne(() => ConversationEntity)
    @JoinColumn({ name: "conversation_id" })
    conversation: ConversationEntity;

    @Column()
    conversationId: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}