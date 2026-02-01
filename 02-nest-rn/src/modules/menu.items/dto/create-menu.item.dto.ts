import { IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateMenuItemDto {
    @IsNotEmpty({ message: "Tiêu đề không được để trống" })
    title: string;

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string;

    @IsNumber({}, { message: "Giá phải là một con số" })
    @Min(0, { message: "Giá không được nhỏ hơn 0" })
    basePrice: number;

    @IsNotEmpty({ message: "Hình ảnh không được để trống" })
    image: string;

    @IsMongoId({ message: "ID Menu không hợp lệ" })
    @IsNotEmpty({ message: "Menu không được để trống" })
    menu: string;
}