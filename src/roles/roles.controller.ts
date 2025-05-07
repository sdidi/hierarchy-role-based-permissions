import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Get()
  async getAllRoles() {
    return this.rolesService.getAllRoles();
  }


  @Post(':roleId/permissions')
  async assignPermissions(
    @Param('roleId') roleId: number,
    @Body() assignPermissionsDto: { permissionIds: number[] },
  ) {
    return this.rolesService.assignPermissionsToRole(roleId, assignPermissionsDto.permissionIds);
  }


  @Get(':roleId/permissions')
  async getPermissionsByRole(@Param('roleId') roleId: number) {
    return this.rolesService.getPermissionsByRole(roleId);
  }
}
