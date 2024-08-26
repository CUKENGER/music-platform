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
  parentId?: string;

  @IsOptional()
  @IsString()
  trackId?: string;

  @IsOptional()
  @IsString()
  artistId?: string;
}