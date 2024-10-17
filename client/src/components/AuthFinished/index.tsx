"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const AuthFinished = () => {
  const router = useRouter();

  return (
    <Stack w="full" gap="5">
      <Text fontSize="2xl">Готово!</Text>
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Готово!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Тепер Ви можете користуватись системою.
        </AlertDescription>
      </Alert>
      <Button
        variant="solid"
        colorScheme="teal"
        alignSelf={{ lg: "flex-end" }}
        onClick={() => router.push("/")}
      >
        Завершити
      </Button>
    </Stack>
  );
};
