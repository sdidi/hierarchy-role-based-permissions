import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let rolesService: RolesService;

  const mockRolesService = {
    createRole: jest.fn(),
    getAllRoles: jest.fn(),
    assignPermissionsToRole: jest.fn(),
    getPermissionsByRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createRole', () => {
    it('should call rolesService.createRole with correct DTO', async () => {
      const dto: CreateRoleDto = { name: 'Admin', structureId: 1 };
      const createdRole = { id: 1, ...dto };
      mockRolesService.createRole.mockResolvedValue(createdRole);

      const result = await controller.createRole(dto);
      expect(result).toEqual(createdRole);
      expect(mockRolesService.createRole).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      const roles = [{ id: 1, name: 'Admin' }];
      mockRolesService.getAllRoles.mockResolvedValue(roles);

      const result = await controller.getAllRoles();
      expect(result).toEqual(roles);
      expect(mockRolesService.getAllRoles).toHaveBeenCalled();
    });
  });

  describe('assignPermissions', () => {
    it('should call assignPermissionsToRole with correct parameters', async () => {
      const roleId = 1;
      const permissionIds = [101, 102];
      const response = { success: true };
      mockRolesService.assignPermissionsToRole.mockResolvedValue(response);

      const result = await controller.assignPermissions(roleId, { permissionIds });
      expect(result).toEqual(response);
      expect(mockRolesService.assignPermissionsToRole).toHaveBeenCalledWith(roleId, permissionIds);
    });
  });

  describe('getPermissionsByRole', () => {
    it('should return permissions for the given role', async () => {
      const roleId = 1;
      const permissions = [{ id: 101, name: 'READ' }];
      mockRolesService.getPermissionsByRole.mockResolvedValue(permissions);

      const result = await controller.getPermissionsByRole(roleId);
      expect(result).toEqual(permissions);
      expect(mockRolesService.getPermissionsByRole).toHaveBeenCalledWith(roleId);
    });
  });
});
