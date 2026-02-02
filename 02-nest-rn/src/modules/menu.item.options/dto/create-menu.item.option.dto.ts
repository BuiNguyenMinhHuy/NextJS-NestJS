import { IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateMenuItemOptionDto {
    @IsMongoId({ message: "ID món ăn không hợp lệ" })
    @IsNotEmpty({ message: "Món ăn không được để trống" })
    menuItem: string;

    @IsNotEmpty({ message: "Tiêu đề tùy chọn không được để trống" })
    title: string;

    @IsNotEmpty({ message: "Mô tả không được để trống" })
    description: string;

    @IsNumber({}, { message: "Giá thêm phải là một con số" })
    @Min(0, { message: "Giá thêm không được nhỏ hơn 0" })
    additionalPrice: number;

    @IsNotEmpty({ message: "Mô tả tùy chọn không được để trống" })
    optionalDescription: string;
}