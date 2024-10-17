"use client";

import { FC } from "react";
import { HeaderProfileMenuProps } from "./types";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { Routes } from "@/types/Routes";

export const HeaderProfileMenu: FC<HeaderProfileMenuProps> = ({ username }) => {
  const router = useRouter();

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {username}
      </MenuButton>
      <MenuList>
        <MenuItem
          as="button"
          onClick={() => router.push(Routes.PROFILE_SETTINGS)}
        >
          Змінити дані облікового запису
        </MenuItem>
        <MenuItem as="button" onClick={() => router.push(Routes.LOGOUT)}>
          Вийти з облікового запису
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
