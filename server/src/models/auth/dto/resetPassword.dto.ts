import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '1fsdfsdfsdvssdv', description: 'token' })
  @IsString()
  readonly token: string;

  @ApiProperty({ example: 'qwerty', description: 'newPassword' })
  @IsString()
  readonly newPassword: string;
}

export class SendEmailDto {
  @ApiProperty({ example: 'loh@pidoras.com', description: 'email' })
  @IsString()
  readonly email: string;
}
