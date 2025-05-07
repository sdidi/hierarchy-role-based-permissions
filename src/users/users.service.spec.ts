import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Role } from '../roles/roles.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
});

const mockRoleRepository = () => ({
  findByIds: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: jest.Mocked<Repository<User>>;
  let roleRepo: jest.Mocked<Repository<Role>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: getRepositoryToken(Role), useFactory: mockRoleRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    roleRepo = module.get(getRepositoryToken(Role));
  });

  describe('create', () => {
    it('should hash password and save user', async () => {
      const dto = { name: 'John', password: 'pass123', roleIds: [1], structureId: 100 };
      const hashed = await bcrypt.hash(dto.password, 10);
      const mockRoles = [{ id: 1, name: 'Admin' }];

      roleRepo.findByIds.mockResolvedValue(mockRoles as any);
      userRepo.save.mockResolvedValue({ ...dto, password: hashed, roles: mockRoles } as any);

      const result = await service.create(dto as any);

      expect(result.password).not.toBe(dto.password);
      expect(userRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        name: dto.name,
        structureId: dto.structureId,
        roles: mockRoles,
      }));
    });
  });

  describe('findAll', () => {
    it('should return users with allowed roles and include the current user', async () => {
      const currentUser = { id: 1 };
      const role1 = { id: 1, structureId: 10 };
      const userWithRoles = { ...currentUser, roles: [role1] };

      userRepo.findOne.mockResolvedValue(userWithRoles as any);
      roleRepo.find.mockResolvedValueOnce([{ id: 2, structureId: 10, parentRole: role1 }] as any);
      userRepo.find.mockResolvedValue([{ id: 2, roles: [{ id: 2 }] }] as any);

      const result = await service.findAll(currentUser as any);

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({ id: 2 }),
      ]));
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.findAll({ id: 1 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return the user if found', async () => {
      const mockUser = { id: 1, name: 'Test', roles: [] };
      userRepo.findOne.mockResolvedValue(mockUser as any);
      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user roles and save', async () => {
      const mockUser = { id: 1, roles: [] };
      const newRoles = [{ id: 2 }];
      userRepo.findOne.mockResolvedValue(mockUser as any);
      roleRepo.findByIds.mockResolvedValue(newRoles as any);
      userRepo.save.mockResolvedValue({ ...mockUser, roles: newRoles } as any);

      const result = await service.update('1', { roleIds: [2] } as any);
      expect(result.roles).toEqual(newRoles);
    });

    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.update('1', { roleIds: [] })).rejects.toThrow('User not found');
    });

    it('should throw if invalid ID', async () => {
      await expect(service.update('abc', { roleIds: [] })).rejects.toThrow('Invalid user ID');
    });
  });

  describe('remove', () => {
    it('should remove user after finding', async () => {
      const user = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(user as any);
      await service.remove('1');
      expect(userRepo.remove).toHaveBeenCalledWith(user);
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign role if structure matches', async () => {
      const user = { id: 1, structureId: 100, roles: [] };
      const role = { id: 2, structureId: 100, name: 'Manager' };

      userRepo.findOne.mockResolvedValue(user as any);
      roleRepo.findOneBy.mockResolvedValue(role as any);
      userRepo.save.mockResolvedValue({ ...user, roles: [role] } as any);

      const result = await service.assignRoleToUser(1, 2);
      expect(result.roles).toContainEqual(role);
    });

    it('should throw if user or role not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      roleRepo.findOneBy.mockResolvedValue(null);
      await expect(service.assignRoleToUser(1, 2)).rejects.toThrow(NotFoundException);
    });

    it('should throw if structure mismatch', async () => {
      const user = { id: 1, structureId: 100, roles: [] };
      const role = { id: 2, structureId: 200, name: 'Manager' };

      userRepo.findOne.mockResolvedValue(user as any);
      roleRepo.findOneBy.mockResolvedValue(role as any);

      await expect(service.assignRoleToUser(1, 2)).rejects.toThrow(
        `Cannot assign role '${role.name}' to user outside its structure scope`
      );
    });
  });
});
