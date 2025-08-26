import { ApiProperty } from "@nestjs/swagger";

export class PermissionDto {
    @ApiProperty({ example: 'admin' })
    name: string[];
}