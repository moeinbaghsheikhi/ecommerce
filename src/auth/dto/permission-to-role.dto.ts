import { ApiProperty } from "@nestjs/swagger";

export class PermissionToRoleDto {
    @ApiProperty({ example: 1 })
    permission_id: number;

    @ApiProperty({ example: 1 })
    role_id: number;
}