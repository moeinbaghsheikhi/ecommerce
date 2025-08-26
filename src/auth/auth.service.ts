import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Role } from './entities/role.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  async register(mobile: string, password: string, display_name: string) {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    return this.usersService.create({
      mobile,
      password: hashedPassword,
      display_name
    });
  }

  async login(mobile: string, password: string) {
    const user = await this.usersService.findOneByMobile(mobile);
    if(!(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('رمز عبور شما اشتباه است');

    const payload = { mobile: user.mobile, sub: user.id, display_name: user.display_name, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
    }
  }

  async getUserPermission(userId: number): Promise<string[]>{
    const user = await this.usersService.findUserByPermission(userId);

    const permissions = new Set<string>();

    user.roles?.forEach(role => 
      role.permissions?.forEach(p => permissions.add(p.name))
    )

    user.permissions?.forEach(p => permissions.add(p.name));
    
    return Array.from(permissions)
  }
  
  async createRole(name: string) {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async addRoleToUser(userId: number, roleId: number){
    const user = await this.usersService.findUserByPermission(userId);

    const role = await this.roleRepository.findOne({ where: { id:roleId } })
    if(!role) throw new NotFoundException('نقش کاربر پیدا نشد')

    if(!user.roles.find(r => r.id === role.id)){
      return await this.usersService.addRole(userId, role)
    }

    throw new BadRequestException("این نقش قبلا به کاربر اضافه شده است")
  }

   async removeRoleFromUser(userId: number, roleId: number){
    const user = await this.usersService.findUserByPermission(userId);

    const role = await this.roleRepository.findOne({ where: { id:roleId } })
    if(!role) throw new NotFoundException('نقش کاربر پیدا نشد')

    if(user.roles.find(r => r.id === role.id)){
      return await this.usersService.removeRole(userId, roleId)
    }

    throw new BadRequestException("نقش وارد شده معتبر نیست")
  }

  async getUserRoles(userId: number){
    const user = await this.usersService.findUserByPermission(userId);

    return user.roles
  }

  async createPermission(name: string) {
    const permission = this.permissionRepository.create({ name });
    return this.permissionRepository.save(permission);
  }

  async addPermissionToRole(permissionId, roleId){
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions']
    })

    if(!role.permissions.find(p => p.id === permissionId)){
      const permission = await this.permissionRepository.findOne({ where: {id: permissionId} })
      role.permissions.push(permission)
    }else throw new BadRequestException("این مجور از قبل وجود دارد")

    return this.roleRepository.save(role)
  }

  async addPermissionToUser(userId: number, permissionId: number){
    const user = await this.usersService.findUserByPermission(userId);

    const permission = await this.permissionRepository.findOne({ where: { id:permissionId } })
    if(!permission) throw new NotFoundException('مجوز پیدا نشد')

    if(!user.permissions.find(p => p.id === permissionId)){
      let assignWithRole = false
      user.roles.forEach(role => {
        role.permissions.forEach(p => {
          if(p.id == permissionId) assignWithRole = true
        })
      })

    if(assignWithRole) throw new BadRequestException("این مجوز قبلا به کاربر اضافه شده است")

      return await this.usersService.addPermission(userId, permission)
    }

    throw new BadRequestException("این مجوز قبلا به کاربر اضافه شده است")
  }

}