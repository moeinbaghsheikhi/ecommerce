import { ApiProperty } from "@nestjs/swagger";

export class RoleToUserDto {
    @ApiProperty({ example: 1 })
    user_id: number;

    @ApiProperty({ example: 1 })
    role_id: number;
}