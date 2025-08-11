export class CreateUserDto {

    name: string;
    lastname: string;
    dni: string;
    phone: string;
    password: string;
    image?: string;
    notification_token?: string;
}