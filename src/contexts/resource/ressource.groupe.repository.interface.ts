import { RscGroupeEntity } from "./entities/ressource.groupe.entities"

export const RESOURCE_GROUPE_REPOSITORY = Symbol('RESOURCE_GROUPE_REPOSITORY');

export interface IResourceGroupeRepository {
    findCredentialsByEmail(email: string): Promise<RscGroupeEntity | null>;
}