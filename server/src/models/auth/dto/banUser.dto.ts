import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class BanUserDto {

  @ApiProperty({example: "1", description: "Id user"})
  @IsString()
  readonly userId: number;

  @ApiProperty({example: "Сказал нет", description: "Причина бана"})
  @IsString()
  readonly banReason: string
}