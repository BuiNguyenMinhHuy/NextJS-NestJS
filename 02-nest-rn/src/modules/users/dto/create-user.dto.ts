import { IsEmail, IsNotEmpty } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty({ message: 'Name is required' })
    name: string;
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;
    @IsNotEmpty({ message: 'Name is required' })
    password: string;

    phone: string;
    address: string;
    image: string;
}
