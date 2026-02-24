import { Controller, Get, Param, Body, Post, HttpCode, HttpStatus, Request, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { MessageService } from "./message.service";
import { MessageDTO, MessageImageUploadDTO } from "./types/message.dto";
import { JwtAuthGuard } from "../conversation/guards/conversation.guard";
import { RequirePermissions } from "../auth/interface/permissions.decorator";
import { Permissions } from "../auth/types/permission.types";
import { FileInterceptor } from "@nestjs/platform-express";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

@Controller("message")
@UseGuards(JwtAuthGuard)
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get("conversation/:conversationId")
    @RequirePermissions(Permissions.CONVERSATION_READ)
    getMessagesByConversation(@Param("conversationId") conversationId: string, @Request() req: any){
        return this.messageService.getMessagesByConversation(conversationId, req.user.userCredentials.id);
    }
    
    @Post("send")
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(Permissions.MESSAGE_SEND)
    postMessage(@Body() body: MessageDTO, @Request() req: any){
        return this.messageService.sendMessage(body, req.user.userCredentials.id);
    }

    @Post("upload-image")
    @HttpCode(HttpStatus.OK)
    @RequirePermissions(Permissions.MESSAGE_SEND)
    @UseInterceptors(
        FileInterceptor("image", {
            limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
            fileFilter: (req, file, callback) => {
                if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
                    callback(new BadRequestException("Only jpeg, png, and webp images are allowed"), false);
                    return;
                }

                callback(null, true);
            },
        }),
    )
    uploadImageMessage(
        @Body() body: MessageImageUploadDTO,
        @UploadedFile() file: any,
        @Request() req: any,
    ) {
        if (!file) {
            throw new BadRequestException("Image file is required (form-data field: image)");
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            throw new BadRequestException("Image max size is 5MB");
        }

        return this.messageService.uploadImageMessage(body, file, req.user.userCredentials.id);
    }
}