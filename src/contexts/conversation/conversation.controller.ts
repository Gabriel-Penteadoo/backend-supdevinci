import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, Request } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { ConversationEntity } from "./entities/conversation.entities";
import { CreateConversationDTO, UpdateConversationDTO } from "./types/conversation.dto";
import { JwtAuthGuard } from "./guards/conversation.guard";
import { RequirePermissions } from "../auth/interface/permissions.decorator";
import { Permissions } from "../auth/types/permission.types";


@Controller("conversation")
@UseGuards(JwtAuthGuard)
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}
    @Get()
    @RequirePermissions(Permissions.CONVERSATION_READ)
    getConversations(@Request() req: any){
        return this.conversationService.getConversations(req.user.userCredentials.id);
    }


    @Post()
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(Permissions.CONVERSATION_CREATE)
    createConversation(@Body() body: CreateConversationDTO, @Request() req: any): Promise<ConversationEntity>{
        // Crée une nouvelle discussion
        return this.conversationService.createConversation(body.title, req.user.userCredentials.id);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(Permissions.CONVERSATION_UPDATE)
    updateConversation(@Body() body: UpdateConversationDTO, @Request() req: any): Promise<ConversationEntity | string | null>{
        return this.conversationService.updateConversation(body, req.user.userCredentials.id);
    }

    @Get("/:id")
    @RequirePermissions(Permissions.CONVERSATION_READ)
    getConversationById(@Param("id") id: string): Promise<ConversationEntity | string | null>{
        return this.conversationService.findConversationById(id)
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(Permissions.CONVERSATION_DELETE)
    deleteConversation(@Param("id") id: string, @Request() req: any): Promise<boolean>{
        return this.conversationService.deleteConversation({id}, req.user.userCredentials.id)
        
    }
}