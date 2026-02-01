import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';
import { IsMongoId, IsNotEmpty } from "class-validator";

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
}