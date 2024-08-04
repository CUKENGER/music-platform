import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/user/user.model";

@Entity({ name: 'token' })
export class Token {

  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "refreshToken", description: "Токен восстановления" })
  @IsString()
  @Column({ unique: true, nullable: false })
  refreshToken: string;

  @ApiProperty({ example: "accessToken", description: "Токен доступа" })
  @IsString()
  @Column({ default: false })
  accessToken: string;

  @ApiProperty({ example: "1", description: "ID user" })
  @IsString()
  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
