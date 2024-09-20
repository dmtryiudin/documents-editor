"use client";

import { useSearchParams } from "next/navigation";
import { FormEventHandler, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { submitForm } from "./actions";

export const EnterTOTPCodeForm = () => {
  const params = useSearchParams();
  const errorMessage = params.get("errorMessage");
  const token = params.get("token")!;
  const [totpCode, setTotpCode] = useState<string>("");

  const onSubmit: FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    if (totpCode.length === 6) {
      await submitForm(token, totpCode);
    }
  };

  return (
    <Stack w="full" gap="5" as="form" onSubmit={onSubmit}>
      <Text fontSize="3xl">Введіть код з автентифікатору</Text>
      {errorMessage ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Сталася помилка!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <HStack alignSelf="center">
        <PinInput onChange={(e) => setTotpCode(e)}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <Button
        isDisabled={totpCode.length < 6}
        variant="solid"
        colorScheme="teal"
        alignSelf={{ lg: "flex-end" }}
        type="submit"
      >
        Продовжити
      </Button>
    </Stack>
  );
};
