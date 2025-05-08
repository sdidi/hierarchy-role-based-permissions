import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from '../roles/roles.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.structureId = createUserDto.structureId;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    user.password = hashedPassword;
    
    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.roleRepository.findByIds(createUserDto.roleIds);
      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  async findAll(currentUser: User): Promise<User[]> {
    
    const user = await this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: ['roles'],
    });
    if (!user) throw new NotFoundException('User not found');
  
    const userStructureIds = user.roles.map(role => role.structureId);
    const userRoleIds = user.roles.map(role => role.id);
    const minStructureId = Math.min(...userStructureIds);
  
    // Find roles accessible based on current user's position in hierarchy
    const allowedRoleIds = new Set<number>();
  
    const collectAccessibleRoles = async (roleIds: number[]): Promise<void> => {
      if (!roleIds.length) return;
  
      const childRoles = await this.roleRepository.find({
        where: {
          parentRole: {
            id: In(roleIds),
          },
        },
      }) || [];
  
      for (const role of childRoles) {
        if (role.structureId >= minStructureId) {
          allowedRoleIds.add(role.id);
          await collectAccessibleRoles([role.id]);
        }
      }
    };
  
    await collectAccessibleRoles(userRoleIds);
  
    // Fetch users who have any of the allowed roles
    const users = await this.userRepository.find({
      where: {
        roles: {
          id: In([...allowedRoleIds]),
        },
      },
      relations: ['roles'],
    });

  const userAlreadyIncluded = users.some(u => u.id === user.id);
  if (!userAlreadyIncluded) {
    users.push(user);
  }
  
    return users;
  }
  
  
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] });

    if (!user) {
      throw new Error('User not found');
    }

    const roles = await this.roleRepository.findByIds(updateUserDto.roleIds);

    user.roles = roles;

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    const role = await this.roleRepository.findOneBy({ id: roleId });

    if (!user || !role) throw new NotFoundException('User or Role not found');

    if (user.structureId !== role.structureId) {
      throw new Error(`Cannot assign role '${role.name}' to user outside its structure scope`);
    }

    user.roles = [...(user.roles || []), role];
    return this.userRepository.save(user);
  }

}
