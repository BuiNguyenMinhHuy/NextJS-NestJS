import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu.item.dto';
import { IsMongoId, IsNotEmpty } from "class-validator";

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
}