import { IsArray, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

class OrderDetailDto {
    @IsMongoId()
    menuItem: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;
}

export class CreateOrderDto {
    @IsMongoId()
    @IsNotEmpty()
    restaurant: string;

    @IsArray()
    detail: OrderDetailDto[];

    @IsNumber()
    totalPrice: number;
}