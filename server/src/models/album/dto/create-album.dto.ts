import { ApiProperty } from '@nestjs/swagger';
import { AlbumType } from '@prisma/client';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({example: "Yura Hoy"})
  @IsNotEmpty({ message: 'artist is required' })
  @IsString({message: "Should be string"})
  artist: string;

  @ApiProperty({example: "Kolhoznyi Punk"})
  @IsNotEmpty({ message: 'name is required' })
  @IsString({message: "Should be string"})
  name: string;

  @ApiProperty({example: ['Hoy', 'Coy'], type: [String]})
  @IsNotEmpty({ message: 'track_names is required' })
  @IsArray({message: "Should be array"})
  track_names: string[];

  @ApiProperty({example: ['Hoy, Hoy, Hoy', 'Coy jiv you dead']})
  @IsArray({message: "Should be array"})
  @IsNotEmpty({ message: 'track_texts is required' })
  track_texts: string[];

  @ApiProperty({example: 'GovnoRock'})
  @IsNotEmpty({ message: 'genre is required' })
  @IsString({message: "Should be string"})
  genre: string;

  @ApiProperty({example: 'GovnoRock music for the masses'})
  @IsNotEmpty({ message: 'description is required' })
  @IsString({message: "Should be string"})
  description: string;

  @ApiProperty({example: '19 january 1022'})
  @IsNotEmpty({ message: 'releaseDate is required' })
  @IsString({message: "Should be string"})
  releaseDate: string;

  @ApiProperty({example: ['Yura Hoy', 'Yura Coy']})
  @IsArray({message: "Should be array"})
  @IsOptional()
// TODO: Проверить featuredArtist Album
  featArtists?: string[];

  @ApiProperty({example: AlbumType.ALBUM})
  @IsOptional()
  type?: AlbumType;

}
