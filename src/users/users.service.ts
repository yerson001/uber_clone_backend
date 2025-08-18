import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rol } from '../roles/rol.entity';
import { CloudinaryService } from 'src/utils/cloud_storage';
//import storage = require('../utils/cloud_storage');
const uploadToCloudinary = require('../utils/cloud_storage');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private cloudinaryService: CloudinaryService, // Inyección del servicio de Cloudinary
  ) {}

  create(user: CreateUserDto) {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find({ relations: ['roles'] });
  }

  async update(id: number, user: UpdateUserDto) {
    console.log('UPDATE DAT: ', user);

    const userFound = await this.usersRepository.findOneBy({ id: id });

    if (!userFound) {
      throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
    }

    const updatedUser = Object.assign(userFound, user);
    return this.usersRepository.save(updatedUser);
  }

  async updateWithImage(file: Express.Multer.File, id: number, userData: UpdateUserDto) {
    try {
      if (!file) {
        throw new Error('No se proporcionó un archivo para subir.');
      }

      const url = await this.cloudinaryService.uploadFile(file); // Usar el servicio inyectado

      if (url === undefined || url === null) {
        throw new HttpException('La imagen no se pudo guardar', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const userFound = await this.usersRepository.findOneBy({ id: id });

      if (!userFound) {
        throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
      }

      userData.image = url;
      const updatedUser = Object.assign(userFound, userData);
      return this.usersRepository.save(updatedUser);
    } catch (error) {
      console.error('Error al subir la imagen:', error.message);
      throw new Error('Error al subir la imagen');
    }
  }
}