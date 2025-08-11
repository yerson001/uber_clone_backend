import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Carga las variables de entorno del .env

export default new DataSource({
    type: 'mysql', // o 'postgres', 'mariadb', etc.
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        __dirname + '/**/*.entity{.ts,.js}',
    ],
    migrations: [
        __dirname + '/migration/*{.ts,.js}',
    ],
    synchronize: false, // Debe ser false
});