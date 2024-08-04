import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class AddRoleDto {


  @ApiProperty({example: "ADMIN", description: "Роль пользователя"})
  @IsString()
  readonly value: string;

  @ApiProperty({example: "2", description: "ID пользователя"})
  @IsNumber()
  readonly userId: number
}