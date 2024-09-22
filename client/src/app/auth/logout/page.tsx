import { SessionManagement } from "@/service/SessionManagement";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  await SessionManagement.logout();
  return redirect("/");
}
