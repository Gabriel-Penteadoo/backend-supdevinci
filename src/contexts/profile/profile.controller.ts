import { Controller, Get, HttpStatus, Param, Put, HttpCode } from "@nestjs/common";
import { ProfileService } from "./profile.service";

@Controller("profile")
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
    @Get(":id")
    getProfile(@Param('id') id: string): string {
        console.log('Received request for profile with id:', id);
        return this.profileService.getProfile(id);
    }
    @Put("me")
    @HttpCode(HttpStatus.OK)
    updateMyProfile(){
        // Met à jour le profil de l'utilisateur connecté
    }
}