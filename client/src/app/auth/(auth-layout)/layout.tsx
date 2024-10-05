import { Box, Center, Container } from "@chakra-ui/react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container maxW="100%" bg="cyan.700" h="100%">
      <Center h="100%" py="4">
        <Box
          bg="white"
          rounded="lg"
          p="5"
          w={{ base: "100%", lg: "90%", xl: "75%" }}
        >
          {children}
        </Box>
      </Center>
    </Container>
  );
}
