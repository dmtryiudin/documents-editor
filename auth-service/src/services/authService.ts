import bcrypt from "bcrypt";
import { ResponseError } from "../lib/responseError";
import { User } from "../models/User";
import { AuthRequest } from "../types/AuthRequest";
import { TokenService } from "./tokenService";
import { TotpService } from "./totpService";
import { F2ALoginRequest } from "../types/F2ALoginRequest";
import { UserDTO } from "../dto/UserDTO";

export class AuthService {
  static async registration({ username, password }: AuthRequest) {
    const userWithSameName = await User.findOne({ username });

    if (userWithSameName) {
      throw ResponseError.badRequest(
        "Користувач з таким іменем користувача вже існує"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const {
      secret,
      authUri,
      encryptSecretIv: encryptTotpSecretIv,
    } = await TotpService.registerTotp(username);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
      totpSecret: secret,
      encryptTotpSecretIv,
    });

    const accessToken = TokenService.generateAccessToken(createdUser.id);
    const refreshToken = await TokenService.generateRefreshToken(
      createdUser.id
    );

    return {
      user: { ...new UserDTO(createdUser) },
      accessToken,
      refreshToken,
      totpUri: authUri,
    };
  }

  static async preLogin({ username, password }: AuthRequest) {
    const candidate = await User.findOne({ username });

    if (!candidate) {
      throw ResponseError.unauthorized(
        "Не вдалося здійснити вхід. Перевірте правильність імені користувача або паролю."
      );
    }

    const comparePasswords = await bcrypt.compare(password, candidate.password);

    if (!comparePasswords) {
      throw ResponseError.unauthorized(
        "Не вдалося здійснити вхід. Перевірте правильність імені користувача або паролю."
      );
    }

    const token = await TokenService.generatePreLoginToken(candidate.id);

    return { preLoginToken: token };
  }

  static async f2aLogin({ token, totpCode }: F2ALoginRequest) {
    const tokenData = await TokenService.validatePreLoginToken(token);
    const tokenPayload = TokenService.getTokenData(tokenData);

    if (!tokenPayload) {
      throw ResponseError.unauthorized("Невірні дані для автентифікації.");
    }

    const candidate = await User.findById(tokenPayload.userId);

    if (!candidate) {
      throw ResponseError.unauthorized("Невірні дані для автентифікації.");
    }

    const secret = candidate.totpSecret;
    const encryptedSecretIv = candidate.encryptTotpSecretIv;
    const isTotpValid = await TotpService.verifyTotp(
      totpCode,
      secret,
      encryptedSecretIv
    );

    if (!isTotpValid) {
      throw ResponseError.unauthorized("Невірний код з автентифікатору.");
    }

    const accessToken = TokenService.generateAccessToken(candidate.id);
    const refreshToken = await TokenService.generateRefreshToken(candidate.id);

    await TokenService.killPreLoginToken(candidate.id);

    return {
      user: { ...new UserDTO(candidate) },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string) {
    const refreshTokenData = await TokenService.validateRefreshToken(
      refreshToken
    );
    const refreshTokenPayload = TokenService.getTokenData(refreshTokenData);

    if (!refreshTokenPayload) {
      throw ResponseError.unauthorized("Невірні дані для автентифікації.");
    }

    const accessTokenResult = TokenService.generateAccessToken(
      refreshTokenPayload.userId
    );
    const refreshTokenResult = await TokenService.generateRefreshToken(
      refreshTokenPayload.userId
    );

    return { accessToken: accessTokenResult, refreshToken: refreshTokenResult };
  }
}
