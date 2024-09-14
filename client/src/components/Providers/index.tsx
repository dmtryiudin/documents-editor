"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { FC } from "react";
import { ProvidersProps } from "./types";

export const Providers: FC<ProvidersProps> = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};
