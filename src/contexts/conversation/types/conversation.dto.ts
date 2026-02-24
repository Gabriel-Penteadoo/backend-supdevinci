import { IsString } from "class-validator";

export class CreateConversationDTO {
    @IsString()
    title: string
}

export class UpdateConversationDTO{
    @IsString()
    title: string

    @IsString()
    id: string
}