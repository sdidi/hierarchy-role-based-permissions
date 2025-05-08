// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { Role } from '../roles/roles.entity';
import { Permission } from '../permissions/permissions.entity';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    RolesModule,
    PermissionsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    TypeOrmModule, 
  ],
})
export class UsersModule {}
