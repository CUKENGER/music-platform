import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegUserDto } from 'src/user/dto/regUser.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import * as uuid from 'uuid';
import { TokenService } from '../token/token.service';
import { MailService } from './mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiError } from 'src/exceptions/api.error';

export interface RegUserResponse{
  accessToken: string,
  refreshToken: string,
  user: RegUserDto
}

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    private mailService: MailService,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}


  async login(dto: UserDto) {
    const user = await this.userRepository.findOne({where: {email: dto.email}})
    if(!user) {
      throw ApiError.BadRequest('User with this email not found')
    }

    const isPassEquals = await bcrypt.compare(dto.password, user.password)
    if(!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password')
    }

    const userDto = new RegUserDto(user)
    const tokens = this.tokenService.generateTokens({...userDto})
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto      
    }
  }

  async registration(dto: UserDto) : Promise<RegUserResponse> {
    const candidate = await this.userService.getByEmail(dto.email)
    if(candidate) {
      throw new HttpException("User with this email already exists", HttpStatus.BAD_REQUEST)
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)
    const activationLink = uuid.v4()

    const user = await this.userService.registration(dto.email, hashPassword, activationLink)

    await this.mailService.sendActivationMail(dto.email, `${process.env.API_URL}/api/activate/${activationLink}`)

    const userDto = new RegUserDto(user)
    const tokens = this.tokenService.generateTokens({...userDto})
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto      
    }
  }

  async logout(refreshToken) {
    const token = await this.tokenService.removeToken(refreshToken)
    return token
  }

  async activate(activationLink) {
    const user = await this.userRepository.findOne({where: {activationLink}})
    if(!user) {
      throw ApiError.BadRequest('Error in activate, incorrect activation link')
    }

    user.isActivated = true
    await this.userRepository.save(user)
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    
    const tokenData = this.tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await this.tokenService.findToken(refreshToken)
    if(!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }

    const user = await this.userRepository.findOne({where: {id: tokenData}})
    const userDto = new RegUserDto(user)
    const tokens = this.tokenService.generateTokens({...userDto})
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto      
    }
  }

  private async generateToken(user: User) {
    const payload = {email: user.email, id: user.id, roles: user.roles}
    return {
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(dto: UserDto) {
    const user = await this.userService.getByEmail(dto.email)
    const passwordEquals = await bcrypt.compare(dto.password, user.password)
    if(user && passwordEquals) {
      return user
    }
    throw new UnauthorizedException({message: "Incorrect email or password"})
  }


}
