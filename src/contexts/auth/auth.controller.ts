import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
import { LoginDTO, RegisterDTO, SetUserRoleDTO, UpdateUserPermissionDTO } from "./types/auth.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../conversation/guards/conversation.guard";
import { RequirePermissions } from "./interface/permissions.decorator";
import { Permissions } from "./types/permission.types";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() body: LoginDTO){
        return this.authService.login(body);
    }
    @Post("register")
    @HttpCode(HttpStatus.OK)
    register(@Body() body: RegisterDTO): Promise<string | boolean> {
        return this.authService.register(body);
    }
    @Get("profile/:id")
    @HttpCode(HttpStatus.OK)
    getProfile(@Req() req): Promise<any> {
        const id = req.params.id;
        return this.authService.getProfile(id);
    }

    @Put("permissions/grant")
    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permissions.ADMIN_MANAGE_USERS)
    @HttpCode(HttpStatus.OK)
    grantPermission(@Body() body: UpdateUserPermissionDTO) {
        return this.authService.grantPermission(body);
    }

    @Put("permissions/revoke")
    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permissions.ADMIN_MANAGE_USERS)
    @HttpCode(HttpStatus.OK)
    revokePermission(@Body() body: UpdateUserPermissionDTO) {
        return this.authService.revokePermission(body);
    }

    @Put("permissions/toggle")
    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permissions.ADMIN_MANAGE_USERS)
    @HttpCode(HttpStatus.OK)
    togglePermission(@Body() body: UpdateUserPermissionDTO) {
        return this.authService.togglePermission(body);
    }

    @Put("permissions/role")
    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permissions.ADMIN_MANAGE_USERS)
    @HttpCode(HttpStatus.OK)
    setRole(@Body() body: SetUserRoleDTO) {
        return this.authService.setRole(body);
    }
}