import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Role } from './roles/roles.entity';
import { Permission } from './permissions/permissions.entity';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'password',
    database: 'permissions_db',
    entities: [User, Role, Permission],
    synchronize: true, // Set to false in production
  }),
  ConfigModule.forRoot({
    isGlobal: true, 
  }),
  UsersModule,
  AuthModule,
  RolesModule,
  PermissionsModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
