import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RscGroupeEntity } from "./entities/ressource.groupe.entities";
import { Repository } from "typeorm";

@Injectable()
export class RscGroupeRepository {
    constructor(
        @InjectRepository(RscGroupeEntity)
        private readonly rscGroupeRepository: Repository<RscGroupeEntity>,
    ) { }

}