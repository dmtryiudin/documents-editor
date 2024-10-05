import { authenticator } from "otplib";
import CryptoJS from "crypto-js";

export class TotpService {
  static registerTotp(userName: string) {
    const secret = authenticator.generateSecret();
    const authUri = authenticator.keyuri(
      userName,
      process.env.SERVICE_NAME!,
      secret
    );

    const encryptedSecret = CryptoJS.AES.encrypt(
      secret,
      process.env.TOTP_SECRET_ENCRYPTION_KEY!
    ).toString();

    return { secret: encryptedSecret, authUri };
  }

  static verifyTotp(key: string, encryptedSecret: string) {
    const bytes = CryptoJS.AES.decrypt(
      encryptedSecret,
      process.env.TOTP_SECRET_ENCRYPTION_KEY!
    );
    const decryptedSecret = bytes.toString(CryptoJS.enc.Utf8);

    const isValid = authenticator.verify({
      token: key,
      secret: decryptedSecret,
    });

    return isValid;
  }
}
