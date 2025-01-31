import { RegUserDto } from "models/user/dto/regUser.dto";

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  payload: RegUserDto;
}
