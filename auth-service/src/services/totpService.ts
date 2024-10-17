import { authenticator } from "otplib";
import { AESEncryptionService } from "./aesEncryptionService";

export class TotpService {
  static async registerTotp(userName: string) {
    const secret = authenticator.generateSecret();
    const authUri = authenticator.keyuri(
      userName,
      process.env.SERVICE_NAME!,
      secret
    );

    const encryptSecretIv = AESEncryptionService.generateUtf8Iv();
    const encryptedSecret = await AESEncryptionService.encrypt({
      msg: secret,
      key: process.env.TOTP_SECRET_ENCRYPTION_KEY!,
      iv: encryptSecretIv,
    });

    return { secret: encryptedSecret, authUri, encryptSecretIv };
  }

  static async verifyTotp(
    key: string,
    encryptedSecret: string,
    encryptSecretIv: string
  ) {
    const decryptedSecret = await AESEncryptionService.decrypt({
      hexEncryptedMsg: encryptedSecret,
      key: process.env.TOTP_SECRET_ENCRYPTION_KEY!,
      iv: encryptSecretIv,
    });

    const isValid = authenticator.verify({
      token: key,
      secret: decryptedSecret,
    });

    return isValid;
  }
}
