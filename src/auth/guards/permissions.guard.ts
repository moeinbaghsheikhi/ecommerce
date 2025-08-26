import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { Permission } from "../entities/permission.entity";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";


@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService
    ){}
    async canActivate(context: ExecutionContext) {
        // get permissions in metadata
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getClass(),
            context.getHandler()
        ])

        if(!requiredPermissions) return true;

        // get user data
        const { user } = context.switchToHttp().getRequest();
        const userId   = user.id;

        const userPermission = await this.authService.getUserPermission(userId);

        const hasPermissions = requiredPermissions.every(permission => userPermission.includes(permission))

        if(!hasPermissions) throw new ForbiddenException('شما مجوز لازم برای این عملیات رو ندارید!')

        return true;
    }
}