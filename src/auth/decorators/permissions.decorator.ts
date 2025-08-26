import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...params: string[]) => SetMetadata(PERMISSIONS_KEY, params)