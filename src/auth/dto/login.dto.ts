import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @IsString({ message: "موبایل باید یک رشته باشد" })
    @IsNotEmpty({ message: "موبایل نمیتواند خالی باشد" })
    @Matches(/^.{11}$/, { message: "شماره موبایل باید 11 رقم باشد." })
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: '09135882811' })
    mobile: string;

    @IsString({ message: "رمز عبور باید یک رشته باشد" })
    @IsNotEmpty({ message: "رمز عبور نمیتواند خالی باشد" })
    // @MinLength(8, { message: "رمز عبور باید حداقل 8 کاراکتر باشد" })
    @MaxLength(16, { message: "رمز عبور باید حداکثر 16 کاراکتر باشد" })
    @ApiProperty({ example: '12345678' })
    password: string;
}