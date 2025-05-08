import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { Permission } from '../permissions/permissions.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>, 
  ) {}

  async createRole(roleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = roleDto.name;
    role.structureId = roleDto.structureId;
  
    if (roleDto.parentRoleId) {
      const parentRole = await this.rolesRepository.findOne({
        where: { id: roleDto.parentRoleId },
        relations: ['permissions'],
      });
  
      if (!parentRole) {
        throw new Error(`Parent role with ID ${roleDto.parentRoleId} not found.`);
      }
  
      if (parentRole.structureId >= role.structureId) {
        throw new Error(
          `Parent role must have a structureId smaller than the new role. Parent: ${parentRole.structureId}, New: ${role.structureId}`
        );
      }
  
      role.parentRole = parentRole;
      role.permissions = [...(parentRole.permissions ?? [])];
    }
  
    return this.rolesRepository.save(role);
  }
  

  async getAllRoles(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['permissions'] }); // Fetch roles with permissions
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const permissions = await this.permissionsRepository.findByIds(permissionIds);
    role.permissions = permissions;

    return this.rolesRepository.save(role);
  }

  async getPermissionsByRole(roleId: number): Promise<Permission[]> {
    const role = await this.rolesRepository.findOne({
        where: { id: roleId },
        relations: ['permissions', 'parentRole'],
      });
  
      if (!role) {
        throw new Error(`Role with ID ${roleId} not found`);
      }
  
      const permissions = [...role.permissions];
      let currentRole = role.parentRole;
  
      while (currentRole) {
        permissions.push(...currentRole.permissions);
        currentRole = currentRole.parentRole;
      }
  
      return permissions;
  }
}
