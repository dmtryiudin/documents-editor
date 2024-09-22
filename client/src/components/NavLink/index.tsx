"use client";

import { Link, LinkProps } from "@chakra-ui/next-js";
import { FC } from "react";

export const NavLink: FC<LinkProps> = ({ ...rest }) => {
  return <Link {...rest} />;
};
