import { IsString, IsInt, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsInt()
  structureId: number;

  @IsArray()
  @IsInt({ each: true })
  roleIds: number[];  // The IDs of the roles to assign
}
