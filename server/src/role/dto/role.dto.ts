import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class RoleDto {
  @ApiProperty({ example: "ADMIN", description: "Роль пользователя" })
  @Matches(/^[A-Z]+$/, { message: "Value should be uppercase" })
  @IsString({ message: "Should be a string" })
  readonly value: string;

  @ApiProperty({ example: "Администратор", description: "Описание роли" })
  @IsString({ message: "Should be a string" })
  readonly description: string;
}
