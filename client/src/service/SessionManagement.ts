import "server-only";

import { prisma } from "@/consts/prisma";
import { Session } from "@/types/Session";
import CryptoJS from "crypto-js";
import { cookies } from "next/headers";
import { SESSION_ID } from "@/consts/hardcodedStrings";

export class SessionManagement {
  static async setSession(authData: Session) {
    const jsonSession = JSON.stringify(authData);
    const encryptedSession = CryptoJS.AES.encrypt(
      jsonSession,
      process.env.SESSION_ENCRYPTION_KEY!
    ).toString();

    const createdSession = await prisma.session.create({
      data: { encryptedSession },
    });

    const encryptedSessionId = CryptoJS.AES.encrypt(
      createdSession.id.toString(),
      process.env.SESSION_ID_ENCRYPTION_KEY!
    ).toString();

    cookies().set(SESSION_ID, encryptedSessionId, { httpOnly: true });
  }

  static async getSession(withTokens = false) {
    try {
      const encryptedSessionId = cookies().get(SESSION_ID)?.value;
      const sessionId = encryptedSessionId
        ? CryptoJS.AES.decrypt(
            encryptedSessionId,
            process.env.SESSION_ID_ENCRYPTION_KEY!
          ).toString(CryptoJS.enc.Utf8)
        : null;

      if (!sessionId) {
        return null;
      }

      const encryptedSession = await prisma.session.findFirst({
        where: { id: +sessionId },
      });

      if (!encryptedSession?.encryptedSession) {
        return null;
      }

      const bytes = CryptoJS.AES.decrypt(
        encryptedSession?.encryptedSession,
        process.env.SESSION_ENCRYPTION_KEY!
      );
      const decryptedSession = JSON.parse(
        bytes.toString(CryptoJS.enc.Utf8)
      ) as Session;

      const { user, ...tokens } = decryptedSession;

      if (withTokens) {
        return { user, ...tokens };
      }

      return { user };
    } catch {
      return null;
    }
  }

  static async logout() {
    try {
      const encryptedSessionId = cookies().get(SESSION_ID)?.value;
      const sessionId = encryptedSessionId
        ? CryptoJS.AES.decrypt(
            encryptedSessionId,
            process.env.SESSION_ID_ENCRYPTION_KEY!
          ).toString(CryptoJS.enc.Utf8)
        : null;

      if (!sessionId) {
        return;
      }

      await prisma.session.delete({ where: { id: +sessionId } });
      cookies().delete(SESSION_ID);
    } catch {
      return;
    }
  }
}
