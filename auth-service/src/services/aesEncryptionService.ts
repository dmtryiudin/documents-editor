import aes from "js-crypto-aes";
import crypto from "crypto";

export class AESEncryptionService {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  static generateUtf8Iv() {
    return crypto.randomBytes(8).toString("hex");
  }

  static async encrypt({
    msg,
    key,
    iv,
  }: {
    msg: string;
    key: string;
    iv: string;
  }) {
    const encodedMessage = this.encoder.encode(msg);
    const encodedKey = this.encoder.encode(key);
    const encodedIv = this.encoder.encode(iv);

    const encryptedMessage = await aes.encrypt(encodedMessage, encodedKey, {
      name: "AES-CBC",
      iv: encodedIv,
    });

    const hexEncryptedText = Buffer.from(encryptedMessage).toString("hex");
    return hexEncryptedText;
  }

  static async decrypt({
    hexEncryptedMsg,
    key,
    iv,
  }: {
    hexEncryptedMsg: string;
    key: string;
    iv: string;
  }) {
    const encryptedMessage = new Uint8Array(
      Buffer.from(hexEncryptedMsg, "hex")
    );
    const encodedKey = this.encoder.encode(key);
    const encodedIv = this.encoder.encode(iv);

    const decryptedMessage = await aes.decrypt(encryptedMessage, encodedKey, {
      name: "AES-CBC",
      iv: encodedIv,
    });

    return this.decoder.decode(decryptedMessage);
  }
}
