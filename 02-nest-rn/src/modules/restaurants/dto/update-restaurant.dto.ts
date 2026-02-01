// update-restaurant.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { IsMongoId, IsNotEmpty } from "class-validator";

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;
}