import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsString,  Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendSmsDto {
    @ApiProperty({ example: '["09135882813", "09135882814"]', description: 'شماره موبایل ها' })
    @IsArray({ message: "موبایل باید یک آرایه باشد" })
    mobile: string[];

    @ApiProperty({ example: 'سلام این یک پیامک تست است', description: 'متن پیامک' })
    @IsString({ message: "پیامک باید یک رشته باشد" })
    @IsNotEmpty({ message: "پیامک نمیتواند خالی باشد" })
    message: string;
}