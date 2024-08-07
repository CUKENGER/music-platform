import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Role } from "src/role/role.model";
import { UserRole } from "src/role/userRole.model";
import { Token } from "src/token/token.model";

@Entity({ name: 'user' })
export class User {

  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "cukenger", description: "Никнейм" })
  @IsString()
  @Column({ unique: true, nullable: false})
  username: string;

  @ApiProperty({ example: "user@gmail.com", description: "Почта пользователя" })
  @IsString()
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({ example: "true", description: "Активирован аккаунт или нет" })
  @IsBoolean()
  @Column({ default: false })
  isActivated: boolean;

  @ApiProperty({ example: "qwerty", description: "Пароль пользователя" })
  @IsString()
  @Length(6, 16, {message: "Should be from 6 to 16 symbols"})
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ example: "link", description: "Ссылка для активации" })
  @IsString()
  @Column()
  activationLink: string;

  @ApiProperty({ example: "false", description: "Забанен или нет" })
  @IsBoolean({ message: 'Значение должно быть булевым' })
  @Column({ default: false })
  banned: boolean;

  @ApiProperty({ example: "Сосал члены неприятно", description: "Причина бана" })
  @IsOptional()
  @IsNotEmpty({ message: 'Причина бана не должна быть пустой, если указана' })
  @Column({ nullable: true })
  banReason: string;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable({ name: 'userRoles' })
  roles: Role[];

  @ManyToMany(() => UserRole, userRole => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => Token, token => token.user)
  tokens: Token[];
}
