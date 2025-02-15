import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ example: 'Track name' })
  @IsNotEmpty({ message: 'name not found' })
  @IsString({ message: 'name should be string' })
  name: string;

  @ApiProperty({ example: 'Track artist' })
  @IsNotEmpty({ message: 'artist not found' })
  @IsString({ message: 'artist should be string' })
  artist: string;

  @ApiProperty({ example: 'Track genre' })
  @IsNotEmpty({ message: 'genre not found' })
  @IsString({ message: 'genre should be string' })
  genre: string;

  @ApiProperty({ example: 'Track text' })
  @IsOptional()
  @IsString({ message: 'text should be string' })
  text?: string;

  @ApiProperty({ example: 'Featured artist' })
  @IsOptional()
  @IsString({ message: 'featArtists should be string' })
  featArtists?: string[];
}
