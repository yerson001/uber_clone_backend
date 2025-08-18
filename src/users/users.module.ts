import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtStrategy } from '../auth/jwt/jwt.strategy';
import { Rol } from 'src/roles/rol.entity';
import { CloudinaryService } from 'src/utils/cloud_storage';

@Module({
  imports: [ TypeOrmModule.forFeature([User, Rol]) ],
  providers: [UsersService, JwtStrategy,CloudinaryService],
  controllers: [UsersController],
   exports: [CloudinaryService],
})
export class UsersModule {}
