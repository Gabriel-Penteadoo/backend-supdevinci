import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator"

export class MessageDTO {
    @IsString()
    content: string

    @IsUUID()
    conversationId: string

}

export class MessageImageUploadDTO {
    @IsUUID()
    conversationId: string

    @IsOptional()
    @IsString()
    @MaxLength(500)
    caption?: string
}
