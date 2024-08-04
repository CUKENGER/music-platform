import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUppercase } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "src/user/user.model";
import { UserRole } from "./userRole.model";

@Entity({ name: 'role' })
export class Role {

  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "ADMIN", description: "Роль пользователя" })
  @IsString()
  @IsUppercase({ message: "Value should be uppercase" })
  @Column({ unique: true, nullable: false })
  value: string;

  @ApiProperty({ example: "Администратор", description: "Описание роли" })
  @IsString()
  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => User, user => user.roles)
  @JoinTable({ name: 'userRoles' })
  users: User[];

  @ManyToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];

}
