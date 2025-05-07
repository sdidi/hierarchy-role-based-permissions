import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../roles/roles.entity';
import { Permission } from '../permissions/permissions.entity';
import { IsOptional } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    structureId: number;  // Links to National, City, Suburb

    @ManyToMany(() => Role)
    @JoinTable()
    @IsOptional()
    roles: Role[];

}
