"use server";

import { SessionManagement } from "@/services/SessionManagement";
import { EditProfileDataForm } from "../EditProfileDataForm";

export const ProfileDataFormWrapper = async () => {
  const session = await SessionManagement.getSession();
  return <EditProfileDataForm session={session} />;
};
