import { Injectable, Inject } from '@nestjs/common';
import { RESOURCE_GROUPE_REPOSITORY, IResourceGroupeRepository} from './ressource.groupe.repository.interface';

@Injectable()
export class RscGroupeService {
  constructor(
    @Inject(RESOURCE_GROUPE_REPOSITORY) private readonly resourceGroupeRepository: IResourceGroupeRepository
  ) {}
}
