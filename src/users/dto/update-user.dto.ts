
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @IsInt({ each: true })
  roleIds: number[];

}
