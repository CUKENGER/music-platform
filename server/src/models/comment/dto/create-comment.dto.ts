import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  parentId?: number;

  @IsOptional()
  @IsString()
  trackId?: number;

  @IsOptional()
  @IsString()
  artistId?: number;
}