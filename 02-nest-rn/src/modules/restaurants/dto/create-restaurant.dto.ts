// create-restaurant.dto.ts
import { IsEmail, IsNotEmpty, IsNumber, Min, Max } from "class-validator";

export class CreateRestaurantDto {
    @IsNotEmpty({ message: "Tên nhà hàng không được để trống" })
    name: string;

    @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    phone: string;

    @IsNotEmpty({ message: "Địa chỉ không được để trống" })
    address: string;

    @IsEmail({}, { message: "Email không đúng định dạng" })
    email: string;


}

