import { ApiProperty } from "@nestjs/swagger";

export class PermissionToUserDto {
    @ApiProperty({ example: 1 })
    user_id: number;

    @ApiProperty({ example: 1 })
    permission_id: number;
}