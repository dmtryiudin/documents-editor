"use server";

import { Flex } from "@chakra-ui/react";
import { Logo } from "@/assets/logo";
import Link from "next/link";
import { Routes } from "@/types/Routes";
import { NavLink } from "../NavLink";
import { SessionManagement } from "@/services/SessionManagement";
import { HeaderProfileMenu } from "../HeaderProfileMenu";

export const MainHeader = async () => {
  const session = await SessionManagement.getSession();

  return (
    <Flex as="header" bg="cyan.700" py="3" px="5" justify="space-between">
      <Link href={Routes.MAIN}>
        <Logo />
      </Link>
      <Flex as="nav" gap="5">
        {session ? (
          <HeaderProfileMenu username={session.user.username} />
        ) : (
          <>
            <NavLink color="white" href={Routes.LOGIN}>
              Увійти в обліковий запис
            </NavLink>
            <NavLink color="white" href={Routes.REGISTRATION}>
              Створити обліковий запис
            </NavLink>
          </>
        )}
      </Flex>
    </Flex>
  );
};
