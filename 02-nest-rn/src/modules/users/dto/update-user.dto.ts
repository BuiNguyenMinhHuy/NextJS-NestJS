import { IsMongoId, IsNotEmpty, IsOptional, MinLength } from "class-validator";


export class UpdateUserDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    address: string;

    @IsOptional()
    image: string;
}

export class ChangePasswordDto {
    @IsNotEmpty({ message: "Mật khẩu cũ không được để trống" })
    oldPassword: string;

    @IsNotEmpty({ message: "Mật khẩu mới không được để trống" })
    @MinLength(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
    newPassword: string;

    @IsNotEmpty({ message: "Xác nhận mật khẩu mới không được để trống" })
    confirmPassword: string;
}