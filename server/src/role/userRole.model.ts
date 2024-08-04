import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.model';
import { Role } from './role.model';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'userRole' })
export class UserRole {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор связи' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'Идентификатор роли' })
  @IsNumber()
  @Column()
  roleId: number;

  @ApiProperty({ example: 1, description: 'Идентификатор пользователя' })
  @IsNumber()
  @Column()
  userId: number;

  @ManyToOne(() => Role, role => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: User;
}
