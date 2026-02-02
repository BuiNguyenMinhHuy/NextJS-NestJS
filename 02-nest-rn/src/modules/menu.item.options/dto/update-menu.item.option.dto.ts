import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemOptionDto } from './create-menu.item.option.dto';
import { IsMongoId, IsNotEmpty } from "class-validator";

export class UpdateMenuItemOptionDto extends PartialType(CreateMenuItemOptionDto) {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
}