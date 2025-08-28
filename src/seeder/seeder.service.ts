import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/auth/entities/permission.entity';
import { Role } from 'src/auth/entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class SeederService 
// implements OnApplicationBootstrap 
{
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,

        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>
    ) { }

    // async onApplicationBootstrap() {
    //     await this.seedPermissionAndRole();
    // }

    async seedPermissionAndRole() {
        // step 1. create permissions
        const permissions = [
            // User Permission
            'user:create',
            'user:read',
            'user:edit',
            'user:delete',
            'user:report',

            // Address Permission
            'address:create',
            'address:read',
            'address:edit',
            'address:delete',

            'product:create',
            'product:read',
            'product:edit',
        ]

        for (const permName of permissions) {
            let permission = await this.permissionRepository.findOne({ where: { name: permName } });
            if (!permission) {
                let perm = this.permissionRepository.create({
                    name: permName
                });
                await this.permissionRepository.save(perm);
            }
        }

        // step 1. create roles
        const roles = [
            { name: 'admin', permissions: permissions },
            { name: 'manager', permissions: [] },
            { name: 'user', permissions: [] }
        ]

        for (const roleObj of roles) {
            let role = await this.roleRepository.findOne({ where: { name: roleObj.name } });
            const permissions_data = await this.permissionRepository.findBy({
                name: In(roleObj.permissions)
            });

            if (!role) {
                let role = this.roleRepository.create({
                    name: roleObj.name,
                    permissions: permissions_data
                });
                await this.roleRepository.save(role);
            } else {
                role.permissions = permissions_data
                await this.roleRepository.save(role);
            }
        }
    }
}
