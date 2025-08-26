import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { Public } from "./decorators/public.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RoleDto } from "./dto/role.dto";
import { RoleToUserDto } from "./dto/role-to-user.dto";
import { PermissionDto } from "./dto/permission.dto";
import { PermissionToRoleDto } from "./dto/permission-to-role.dto";
import { PermissionToUserDto } from "./dto/permission-to-user.dto";


@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response){
    const register = await this.authService.register(registerDto.mobile, registerDto.password, registerDto.display_name);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: register,
      message: "با موفقیت ثبت نام کردید"
    })
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const login = await this.authService.login(loginDto.mobile, loginDto.password);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: login,
      message: "با موفقیت وارد شدید"
    })
  }


  @ApiBearerAuth()
  @Post('role')
  async craeteRole(@Body() createRole: RoleDto){
    const role = this.authService.createRole(createRole?.name);

    return role;
  }

  @ApiBearerAuth()
  @Post('role/append-to-user')
  async addRoleToUser(@Body() roleToUser: RoleToUserDto){
    const role = this.authService.addRoleToUser(roleToUser.user_id, roleToUser.role_id);

    return role;
  }

  @ApiBearerAuth()
  @Post('role/remove-from-user')
  async removeRoleFromUser(@Body() roleToUser: RoleToUserDto){
    const role = this.authService.removeRoleFromUser(roleToUser.user_id, roleToUser.role_id);

    return role;
  }

  @ApiBearerAuth()
  @Get('role/get-user-roles/:user_id')
  async getUserRoles(@Param('user_id') user_id: number){
    const role = this.authService.getUserRoles(user_id);

    return role;
  }


  @ApiBearerAuth()
  @Post('permission')
  async craetePermission(@Body() createPermission: PermissionDto){

    if(Array.isArray(createPermission.name)){
      let createdPermissions = []
      createPermission.name.forEach(p => {
        this.authService.createPermission(p);
        createdPermissions.push(p)
      })

      return createdPermissions
    }else{
      const permission = this.authService.createPermission(createPermission?.name);
      return permission;
    }
  }

  @ApiBearerAuth()
  @Post('permission/append-to-role')
  async addPermissionToRole(@Body() permissionToRole: PermissionToRoleDto){
    const role = this.authService.addPermissionToRole(permissionToRole.permission_id, permissionToRole.role_id);

    return role;
  }

  @ApiBearerAuth()
  @Post('permission/append-to-user')
  async addPermissionToUser(@Body() permissionToUser: PermissionToUserDto){
    const role = this.authService.addPermissionToUser(permissionToUser.user_id, permissionToUser.permission_id);

    return role;
  }

  @ApiBearerAuth()
  @Get('permission/get-user-permission/:user_id')
  async getUserPermissions(@Param('user_id') user_id: number){
    const permissions = this.authService.getUserPermission(user_id);

    return permissions;
  }
}