

import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsNumber()
  structureId: number;

  @IsOptional()
  @IsNumber()
  parentRoleId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permissionIds?: number[];
}
