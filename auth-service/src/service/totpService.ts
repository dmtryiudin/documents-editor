import { authenticator } from "otplib";

export class TotpService {
  static registerTotp(userName: string) {
    const secret = authenticator.generateSecret();
    const authUri = authenticator.keyuri(userName, "YourServiceName", secret);

    return { secret, authUri };
  }

  static verifyTotp(key: string, secret: string) {
    const isValid = authenticator.verify({ token: key, secret });

    return isValid;
  }
}
