// src/modules/menus/dto/create-menu.dto.ts
import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty({ message: "Tên menu không được để trống" })
    title: string;

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string;

    @IsNotEmpty({ message: "Hình ảnh không được để trống" })
    image: string;

    @IsMongoId({ message: "ID nhà hàng không hợp lệ" })
    @IsNotEmpty({ message: "Nhà hàng không được để trống" })
    restaurant: string;
}

