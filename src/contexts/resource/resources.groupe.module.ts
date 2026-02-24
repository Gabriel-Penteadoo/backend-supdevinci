import { Module } from "@nestjs/common";
import { ResourceGroupeController } from "./resources.groupe.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RscGroupeEntity } from "./entities/ressource.groupe.entities";
import { RscGroupeService } from "./ressource.groupe.service";
import { RscGroupeRepository } from "./ressource.groupe.repository";
import { RESOURCE_GROUPE_REPOSITORY } from "./ressource.groupe.repository.interface";

@Module({
    imports: [TypeOrmModule.forFeature([
        RscGroupeEntity
    ])],
    controllers: [ResourceGroupeController],
    providers: [RscGroupeService, 
        {provide: RESOURCE_GROUPE_REPOSITORY, useClass: RscGroupeRepository}
    ],
})
export class ResourceModule {}