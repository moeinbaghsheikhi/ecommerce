import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { Permission } from "../entities/permission.entity";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "src/address/entities/address.entity";
import { Repository } from "typeorm";


@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        @InjectRepository(Address)
        private readonly addressRepository: Repository<Address>,
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
        const request = context.switchToHttp().getRequest();
        const userId   = request.user.userId;

        const userPermission = await this.authService.getUserPermission(userId);

        const hasPermissions = requiredPermissions.every(permission => userPermission.includes(this.cleanOwn(permission)))

        if(!hasPermissions) throw new ForbiddenException('شما مجوز لازم برای این عملیات رو ندارید!')

        // check resource own
        for(const permission of requiredPermissions){
            if(permission.endsWith(':own')){
                const [resource, action] = permission.split(':');
                const paramId = request.params['id'];

                const isOwner = await this.checkOwnership(resource, userId, paramId);
                if(isOwner) return true;
                else throw new ForbiddenException('شما دسترسی این عملیات را روی این منبع ندارید!')
            }
        }
 
        return true;
    }

    private cleanOwn(str: string): string{
        if(str.endsWith(":own")){
            return str.slice(0, -4);
        }
        return str;
    }

    private async checkOwnership(resource: string, userId: number, resourceId: number){
        if(resource == 'address'){
            const address = await this.addressRepository.findOne({ where: { id:resourceId }, relations: ['user'] })
            if(!address) return false;
            return address.user.id == userId;
        }

        return false;
    }
}