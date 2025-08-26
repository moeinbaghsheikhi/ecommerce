import { ApiProperty } from "@nestjs/swagger";

export class RoleDto {
    @ApiProperty({ example: 'admin' })
    name: string;
}