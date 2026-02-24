import { Controller, Get, Param, Body, Post, HttpCode, HttpStatus } from "@nestjs/common";


@Controller("groupe")
export class ResourceGroupeController {
    
    @Get(":id")
    postMessage(){
        // Envoie les messages d'un groupe spécifique
    }
}