import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './permissions.entity';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // Create a permission
  @Post()
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<Permission> {
    return this.permissionsService.create(name, description);
  }

  // Get all permissions
  @Get()
  async findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  // Get permission by ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }

  // Update permission
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<Permission> {
    return this.permissionsService.update(id, name, description);
  }

  // Delete permission
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
