import { SessionManagement } from "@/services/SessionManagement";
import { Routes } from "@/types/Routes";
import { Button } from "@chakra-ui/react";

export default async function Home() {
  const session = await SessionManagement.getSession();

  return (
    <>
      <Button as="a" href={Routes.LOGIN}>
        Login
      </Button>
      <Button as="a" href={Routes.REGISTRATION}>
        Registration
      </Button>
      {session ? (
        <Button as="a" href={Routes.LOGOUT}>
          logout
        </Button>
      ) : null}
      <span>Session data:</span>
      {JSON.stringify(session)}
    </>
  );
}
