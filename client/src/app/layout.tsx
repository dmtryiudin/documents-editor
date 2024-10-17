import type { Metadata } from "next";
import { MainHeader, Providers } from "@/components";
import { Box } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box as="html" lang="en" h="100%">
      <Box as="body" h="100%">
        <Providers>
          <Box display="flex" flexDirection="column" h="100%">
            <MainHeader />
            <Box flex="1 1 auto">{children}</Box>
          </Box>
        </Providers>
      </Box>
    </Box>
  );
}
