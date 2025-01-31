import { ApiProperty } from '@nestjs/swagger';
import { Track } from '@prisma/client';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateTracksDto {
  
  @ApiProperty({example: 'Yura Hoy'})
  @IsNotEmpty({ message: 'name is required' })
  @IsString({message: "Should be string"})
  name: string;

  @ApiProperty({example: "Yuta Hoy singing Bomj"})
  @IsNotEmpty({ message: 'text is required' })
  @IsString({message: "Should be string"})
  text: string;

  @ApiProperty({example: [{id: 1, name: 'Hoy', text: 'Hoy singing Bomj'}]})
  @IsOptional()
  @IsArray({message: "Should be an array of tracks"})
  @ValidateNested({each: true})
  tracks?: Track[];

  @ApiProperty({example: 'GovnoRock'})
  @IsNotEmpty({ message: 'genre is required' })
  @IsString({message: "Should be string"})
  genre: string;
}
