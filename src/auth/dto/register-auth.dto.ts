import { IsString, IsNotEmpty, MinLength, IsNumberString, Length } from "class-validator";

export class RegisterAuthDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty({ message: 'El DNI no puede estar vacío' })
    @IsString({ message: 'El DNI debe ser un texto' })
    @IsNumberString({}, { message: 'El DNI debe contener solo números' })
    @Length(8, 8, { message: 'El DNI debe tener 8 dígitos' })
    dni: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener minimo 6 caracteres' })
    password: string;
    
    rolesIds: string[];

}