import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Role } from './roles.entity';
import { Permission } from '../permissions/permissions.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('RolesService', () => {
  let service: RolesService;
  let roleRepo: Repository<Role>;
  let permissionRepo: Repository<Permission>;

  const mockRoleRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockPermissionRepo = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useValue: mockRoleRepo },
        { provide: getRepositoryToken(Permission), useValue: mockPermissionRepo },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    roleRepo = module.get(getRepositoryToken(Role));
    permissionRepo = module.get(getRepositoryToken(Permission));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRole', () => {
    it('should create and save a role without parentRole', async () => {
      const dto = { name: 'Editor', structureId: 2 };
      const savedRole = { id: 1, ...dto };

      mockRoleRepo.save.mockResolvedValue(savedRole);

      const result = await service.createRole(dto);
      expect(result).toEqual(savedRole);
      expect(mockRoleRepo.save).toHaveBeenCalledWith(expect.objectContaining(dto));
    });

    it('should create a role with parentRole and inherit permissions', async () => {
      const dto = { name: 'Editor', structureId: 2, parentRoleId: 5 };
      const parentPermissions = [{ id: 1, name: 'READ' }];
      const parentRole = {
        id: 5,
        name: 'Manager',
        permissions: parentPermissions,
      };

      mockRoleRepo.findOne.mockResolvedValue(parentRole);
      mockRoleRepo.save.mockResolvedValue({ id: 2, ...dto, permissions: parentPermissions });

      const result = await service.createRole(dto);

      expect(mockRoleRepo.findOne).toHaveBeenCalledWith({
        where: { id: 5 },
        relations: ['permissions'],
      });

      expect(result.permissions).toEqual(parentPermissions);
    });
  });

  describe('getAllRoles', () => {
    it('should return all roles with permissions', async () => {
      const roles = [{ id: 1, name: 'Admin', permissions: [] }];
      mockRoleRepo.find.mockResolvedValue(roles);

      const result = await service.getAllRoles();
      expect(result).toEqual(roles);
      expect(mockRoleRepo.find).toHaveBeenCalledWith({ relations: ['permissions'] });
    });
  });

  describe('assignPermissionsToRole', () => {
    it('should assign permissions to a role', async () => {
      const roleId = 1;
      const permissionIds = [101, 102];
      const role = { id: roleId, name: 'User', permissions: [] };
      const permissions = [{ id: 101 }, { id: 102 }];

      mockRoleRepo.findOne.mockResolvedValue(role);
      mockPermissionRepo.findByIds.mockResolvedValue(permissions);
      mockRoleRepo.save.mockResolvedValue({ ...role, permissions });

      const result = await service.assignPermissionsToRole(roleId, permissionIds);
      expect(result.permissions).toEqual(permissions);
      expect(mockPermissionRepo.findByIds).toHaveBeenCalledWith(permissionIds);
    });

    it('should throw error if role not found', async () => {
      mockRoleRepo.findOne.mockResolvedValue(null);
      await expect(service.assignPermissionsToRole(99, [1])).rejects.toThrow('Role with ID 99 not found');
    });
  });

  describe('getPermissionsByRole', () => {
    it('should return permissions including inherited ones', async () => {
      const parentPermission = { id: 201 };
      const permission = { id: 101 };

      const role = {
        id: 1,
        name: 'ChildRole',
        permissions: [permission],
        parentRole: {
          permissions: [parentPermission],
          parentRole: null,
        },
      };

      mockRoleRepo.findOne.mockResolvedValue(role);

      const result = await service.getPermissionsByRole(1);
      expect(result).toEqual([permission, parentPermission]);
    });

    it('should throw error if role not found', async () => {
      mockRoleRepo.findOne.mockResolvedValue(null);
      await expect(service.getPermissionsByRole(42)).rejects.toThrow('Role with ID 42 not found');
    });
  });
});
