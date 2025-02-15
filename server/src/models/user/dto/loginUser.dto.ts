import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Почта пользователя' })
  @IsString({ message: 'Should be a string' })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @ApiProperty({ example: 'qwerty', description: 'Пароль пользователя' })
  @IsNotEmpty({message: 'Password is required'})
  @IsString({ message: 'Should be a string' })
  @Length(4, 16, { message: 'Should be from 4 to 16 symbols' })
  readonly password: string;
}
