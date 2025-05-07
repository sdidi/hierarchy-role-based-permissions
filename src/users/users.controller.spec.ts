import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
      id: 1,
      name: 'sabre',
      structureId: 1,
      roles: [],
      password: ''
  };

  const mockUsersService = {
    create: jest.fn(dto => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [mockUser]),
    findOne: jest.fn(id => ({ id, name: 'Test User' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ deleted: true })),
    assignRoleToUser: jest.fn((userId, roleId) => ({
      userId,
      roleId,
      status: 'assigned',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = { name: 'Jane', password: 'pass123!', structureId: 1, roleIds: [1] };
    expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should find all users', async () => {
    expect(await controller.findAll(mockUser)).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalledWith(mockUser);
  });

  it('should find one user by id', async () => {
    expect(await controller.findOne('1')).toEqual({ id: '1', name: 'Test User' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated', roleIds: [] };
    expect(await controller.update('1', dto)).toEqual({
      id: '1',
      name: 'Updated',
      roleIds: [],
    });
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a user', async () => {
    expect(await controller.remove('1')).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith('1');
  });

  it('should assign a role to a user', async () => {
    const body = { userId: 1, roleId: 2 };
    expect(await controller.assignRoleToUser(body)).toEqual({
      userId: 1,
      roleId: 2,
      status: 'assigned',
    });
    expect(service.assignRoleToUser).toHaveBeenCalledWith(1, 2);
  });
});
