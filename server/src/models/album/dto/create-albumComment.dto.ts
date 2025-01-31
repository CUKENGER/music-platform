import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAlbumCommentDto {

  @ApiProperty({example: 'Yura Hoy'})
  @IsNotEmpty({ message: 'username is required' })
  @IsString({message: "Should be string"})
  username: string;

  @ApiProperty({example: 'I love this album!'})
  @IsNotEmpty({ message: 'text is required' })
  @IsString({message: "Should be string"})
  text: string;

  @ApiProperty({example: 1})
  @IsNotEmpty({ message: 'albumId is required' })
  @IsNumber({}, {message: "Should be number"})
  albumId: number;
}
