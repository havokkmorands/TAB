import { SetMetadata } from '@nestjs/common';

export const IS_GUEST_ONLY = 'isGuestOnly';
export const GuestOnly = () => SetMetadata(IS_GUEST_ONLY, true);
export const IS_AUTH_ONLY = 'isAuthOnly';
export const AuthOnly = () => SetMetadata(IS_AUTH_ONLY, true);
export const NEEDED_PERMISSIONS = 'neededPermissions';
export const NeededPermissions = (...permissions: string[]) =>
  SetMetadata(NEEDED_PERMISSIONS, permissions);
