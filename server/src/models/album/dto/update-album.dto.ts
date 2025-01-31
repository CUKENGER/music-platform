import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAlbumDto {

  @ApiProperty({example: 'Album Yura Hoy'})
  @IsNotEmpty({ message: 'name is required' })
  @IsString({message: "Should be string"})
  name: string;

  @ApiProperty({example: 'GovnoRocks'})
  @IsNotEmpty({ message: 'genre is required' })
  @IsString({message: "Should be string"})
  genre: string;

  @ApiProperty({example: 'Yura Hoy eat kal'})
  @IsNotEmpty({ message: 'description is required' })
  @IsString({message: "Should be string"})
  description: string;

  @ApiProperty({example: '15 january of March 2002'})
  @IsNotEmpty({ message: 'releaseDate is required' })
  @IsString({message: "Should be string"})
  releaseDate: string;

  @ApiProperty({example: {id: 1, name: 'sdf', text: 'fsdf', isNew: false, isUpdated: true}})
  @IsNotEmpty({ message: 'tracks is required' })
  @IsString({message: "Should be string"})
  @IsArray({message: "Should be array"})
  tracks: UpdateAlbumTracksDto[];

  @ApiProperty({example: {id: 1, name: 'sdf', text: 'fsdf', isDeleted: true}})
  @IsOptional()
  @IsString({message: "Should be string"})
  @IsArray({message: "Should be array"})
  deletedTracks?: UpdateAlbumTracksDto[];

  @ApiProperty({example: 'Yura Hoy'})
  @IsNotEmpty({ message: 'artist is required' })
  @IsString({message: "Should be string"})
  artist: string;

  @ApiProperty({example: ['Yura Hoy', "dsfffdsf"]})
  @IsNotEmpty({ message: 'track_names is required' })
  @IsArray({message: "Should be array"})
  track_names: string[];

  @ApiProperty({example: 'Yura Hoy'})
  @IsOptional()
  @IsArray({message: "Should be array"})
  track_texts?: string[];
}

export class UpdateAlbumTracksDto {

  @ApiProperty({example: 1})
  @IsNotEmpty({ message: 'id is required' })
  @IsNumber({}, {message: "Should be number"})
  id: number;

  @ApiProperty({example: 'Album Yura'})
  @IsNotEmpty({ message: 'name is required' })
  @IsString({message: "Should be string"})
  name: string;

  @ApiProperty({example: 'track text'})
  @IsNotEmpty({ message: 'text is required' })
  @IsString({message: "Should be string"})
  text: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString({message: "Should be string"})
  audio?: Express.Multer.File;

  @ApiProperty({example: false})
  @IsNotEmpty({ message: 'isNew is required' })
  @IsBoolean({message: "Should be boolean"})
  isNew: boolean;

  @ApiProperty({example: 'Album Yura Hoy'})
  @IsNotEmpty({ message: 'isUpdated is required' })
  @IsBoolean({message: "Should be boolean"})
  isUpdated: boolean;
}
