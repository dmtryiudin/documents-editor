import "server-only";

import { prisma } from "@/consts/prisma";
import { Session } from "@/types/Session";
import { cookies } from "next/headers";
import { ENCRYPT_SESSION_ID_IV, SESSION_ID } from "@/consts/hardcodedStrings";
import { AESEncryption } from "./AESEncryption";
import { api } from "@/utils/api";
import { ApiRoutes, Routes } from "@/types/Routes";
import { Response } from "@/types/Response";
import { RefreshTokenResponse } from "@/types/RefreshTokenResponse";
import { redirect } from "next/navigation";

export class SessionManagement {
  private static async getSessionId() {
    const encryptedSessionId = cookies().get(SESSION_ID)?.value;
    const encryptedSessionIdIv = cookies().get(ENCRYPT_SESSION_ID_IV)?.value;

    if (!encryptedSessionId || !encryptedSessionIdIv) {
      return null;
    }

    const decryptedSessionId = await AESEncryption.decrypt({
      hexEncryptedMsg: encryptedSessionId,
      key: process.env.SESSION_ID_IV_ENCRYPTION_KEY!,
      iv: encryptedSessionIdIv,
    });

    return Number(decryptedSessionId);
  }

  static async setSession(authData: Session) {
    const jsonSession = JSON.stringify(authData);

    const encryptedSessionIv = AESEncryption.generateUtf8Iv();
    const encryptedSession = await AESEncryption.encrypt({
      msg: jsonSession,
      key: process.env.SESSION_ENCRYPTION_KEY!,
      iv: encryptedSessionIv,
    });

    const createdSession = await prisma.session.create({
      data: { encryptedSession, iv: encryptedSessionIv },
    });

    const encryptedSessionIdIv = AESEncryption.generateUtf8Iv();
    const encryptedSessionId = await AESEncryption.encrypt({
      msg: createdSession.id.toString(),
      key: process.env.SESSION_ID_IV_ENCRYPTION_KEY!,
      iv: encryptedSessionIdIv,
    });

    cookies().set(SESSION_ID, encryptedSessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    cookies().set(ENCRYPT_SESSION_ID_IV, encryptedSessionIdIv, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  static async getSession(): Promise<Omit<
    Session,
    "accessToken" | "refreshToken"
  > | null>;
  static async getSession(
    withTokens: false
  ): Promise<Omit<Session, "accessToken" | "refreshToken"> | null>;
  static async getSession(withTokens: true): Promise<Session | null>;
  static async getSession(withTokens = false) {
    try {
      const sessionId = await this.getSessionId();

      if (!sessionId) {
        return null;
      }

      const encryptedSession = await prisma.session.findFirst({
        where: { id: sessionId },
      });

      if (!encryptedSession?.encryptedSession || !encryptedSession.iv) {
        return null;
      }

      const decryptedSession = await AESEncryption.decrypt({
        hexEncryptedMsg: encryptedSession.encryptedSession,
        key: process.env.SESSION_ENCRYPTION_KEY!,
        iv: encryptedSession.iv,
      });

      const session = JSON.parse(decryptedSession);

      const { user, ...tokens } = session as Session;

      if (withTokens) {
        return { user, ...tokens };
      }

      return { user };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async logout() {
    try {
      const sessionId = await this.getSessionId();

      if (!sessionId) {
        return null;
      }

      cookies().delete(SESSION_ID);
      cookies().delete(ENCRYPT_SESSION_ID_IV);
      await prisma.session.delete({ where: { id: sessionId } });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  static async refreshToken() {
    try {
      const session = await this.getSession(true);

      const refreshToken = session?.refreshToken;

      if (refreshToken) {
        const res = await api<Response<RefreshTokenResponse>>({
          route: ApiRoutes.REFRESH_TOKEN,
          config: { method: "POST", body: JSON.stringify({ refreshToken }) },
        });

        await this.setSession({ ...session, ...res.data });
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }

  static async protectedRoute() {
    try {
      await api({
        route: ApiRoutes.CHECK_ACCESS_TOKEN,
        isProtected: true,
      });
    } catch (e: any) {
      const errorData = e?.message && JSON.parse(e.message);
      const statusCode = errorData.status;

      if (statusCode === 401) {
        redirect(Routes.LOGIN);
      }
    }
  }
}
