import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_METADATA_KEY } from '../types/permission.types';

export const RequirePermissions = (...permissions: bigint[]) =>
  SetMetadata(
    PERMISSIONS_METADATA_KEY,
    permissions.map((permission) => permission.toString()),
  );
