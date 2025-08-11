import { IsString, IsNotEmpty, IsNumberString, Length } from 'class-validator';
export class LoginAuthDto {

    @IsNotEmpty({ message: 'El DNI no puede estar vacío' })
    @IsString({ message: 'El DNI debe ser un texto' })
    @IsNumberString({}, { message: 'El DNI debe contener solo números' })
    @Length(8, 8, { message: 'El DNI debe tener 8 dígitos' })
    dni: string;

    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @IsString({ message: 'La contraseña debe ser un texto' })
    password: string;

}