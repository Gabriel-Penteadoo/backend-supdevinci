export const Permissions = {
  USER_READ_PROFILE: 1n << 0n,
  USER_UPDATE_PROFILE: 1n << 1n,
  CONVERSATION_READ: 1n << 2n,
  CONVERSATION_CREATE: 1n << 3n,
  CONVERSATION_UPDATE: 1n << 4n,
  CONVERSATION_DELETE: 1n << 5n,
  MESSAGE_SEND: 1n << 6n,
  ADMIN_MANAGE_USERS: 1n << 7n,
} as const;

export const Roles = {
  USER:
    Permissions.USER_READ_PROFILE |
    Permissions.USER_UPDATE_PROFILE |
    Permissions.CONVERSATION_READ |
    Permissions.CONVERSATION_CREATE |
    Permissions.CONVERSATION_UPDATE |
    Permissions.CONVERSATION_DELETE |
    Permissions.MESSAGE_SEND,
  MODERATOR:
    Permissions.USER_READ_PROFILE |
    Permissions.USER_UPDATE_PROFILE |
    Permissions.CONVERSATION_READ |
    Permissions.CONVERSATION_CREATE |
    Permissions.CONVERSATION_UPDATE |
    Permissions.CONVERSATION_DELETE |
    Permissions.MESSAGE_SEND,
  ADMIN:
    Permissions.USER_READ_PROFILE |
    Permissions.USER_UPDATE_PROFILE |
    Permissions.CONVERSATION_READ |
    Permissions.CONVERSATION_CREATE |
    Permissions.CONVERSATION_UPDATE |
    Permissions.CONVERSATION_DELETE |
    Permissions.MESSAGE_SEND |
    Permissions.ADMIN_MANAGE_USERS,
} as const;

export const PERMISSIONS_METADATA_KEY = 'required_permissions';

export function toMask(mask: string | number | bigint | null | undefined): bigint {
  if (mask === null || mask === undefined) return 0n;
  if (typeof mask === 'bigint') return mask;
  if (typeof mask === 'number') return BigInt(mask);
  if (mask.trim() === '') return 0n;
  return BigInt(mask);
}

export function addPermission(mask: bigint, permission: bigint): bigint {
  return mask | permission;
}

export function removePermission(mask: bigint, permission: bigint): bigint {
  return mask & ~permission;
}

export function togglePermission(mask: bigint, permission: bigint): bigint {
  return mask ^ permission;
}

export function hasPermission(mask: bigint, permission: bigint): boolean {
  return (mask & permission) !== 0n;
}
