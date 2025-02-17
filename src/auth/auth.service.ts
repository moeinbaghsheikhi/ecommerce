import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import UserRoleEnum from '../users/enums/userRoleEnum';
import * as bcryot from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(mobile: string, password: string, display_name: string) {
    const hashedPassword: string = await bcryot.hash(password, 10);
    return this.usersService.create({
      mobile,
      password: hashedPassword,
      display_name,
      role: UserRoleEnum.NormalUser,
    });
  }

  async login(mobile: string, password: string) {
    const user = await this.usersService.findOneByMobile(mobile);
    if(!(await bcryot.compare(password, user.password))) throw new UnauthorizedException('رمز عبور شما اشتباه است');

    const payload = { mobile: user.mobile, sub: user.id, display_name: user.display_name };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
    }
  }
}