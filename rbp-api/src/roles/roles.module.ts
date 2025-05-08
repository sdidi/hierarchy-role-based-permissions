import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Permission } from 'src/permissions/permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission])
  ],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
