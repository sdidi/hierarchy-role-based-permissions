// src/permissions/permissions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permissions.entity'; // Import the Permission entity
import { PermissionsService } from './permissions.service'; // Service for handling permission logic
import { PermissionsController } from './permissions.controller'; // Controller for managing permission routes

@Module({
  imports: [TypeOrmModule.forFeature([Permission])], // Import the Permission entity
  providers: [PermissionsService], // Provide the PermissionsService
  controllers: [PermissionsController], // Define the PermissionsController
})
export class PermissionsModule {}
