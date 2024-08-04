import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Token } from "./token.model";

@Injectable()
export class TokenService {

  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private jwtService: JwtService
  ) {}

  generateTokens (payload) {
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload)
    return {
      accessToken,
      refreshToken
    }
  }

  validateAccessToken(token) {
    try {
      const tokenData = this.jwtService.verify(token)
      return tokenData
    } catch(e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const tokenData = this.jwtService.verify(token)
      return tokenData
    } catch(e) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await this.tokenRepository.findOne({ where: { userId: userId } });
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return this.tokenRepository.save(tokenData);
      } else {
        console.log('tokenData is null')
      }
      const token = await this.tokenRepository.create({ userId: userId, refreshToken: refreshToken });
      return token;
    } catch (error) {
      console.error("Error saving token:", error);
      throw new Error("Could not save token");
    }
  }

  async removeToken(refreshToken) {
    try {
      const tokenData = await this.tokenRepository.delete({ refreshToken });
      return tokenData
    } catch(e) {
      console.log('Error with removeToken')
    }
  }

  async findToken(refreshToken) {
    try {
      const tokenData = await this.tokenRepository.findOne({where: {refreshToken}})
      return tokenData
    } catch(e) {
      console.log('Error with findToken')
    }
  }
}