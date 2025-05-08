import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Permission } from '../permissions/permissions.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    structureId: number;

    @ManyToOne(() => Role, role => role.children, { nullable: true })
    @JoinColumn({ name: 'parent_role_id' })
    parentRole: Role;

    @OneToMany(() => Role, role => role.parentRole)
    children: Role[];

    @OneToMany(() => User, (user) => user)
    users: User[];

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];

}
