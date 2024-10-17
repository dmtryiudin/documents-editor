"use client";

import { HidePasswordInput, NavLink } from "@/components";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { FC } from "react";
import { FormValues, RegistrationPayloadValidation } from "./types";
import { useFormValidation } from "@/hooks";
import { submitForm } from "./actions";
import { useSearchParams } from "next/navigation";

export const EmailPasswordRegistrationForm: FC = () => {
  const params = useSearchParams();
  const errorMessage = params.get("errorMessage");

  const onSubmit = async (e: FormValues) => {
    await submitForm(e);
  };

  const { submitHandler, registerField, formErrors, isSubmitting } =
    useFormValidation<FormValues>(
      { username: "", password: "" },
      RegistrationPayloadValidation
    );

  return (
    <Stack w="full" gap="5" as="form" onSubmit={submitHandler(onSubmit)}>
      <Text fontSize="2xl">Створити обліковий запис</Text>
      {errorMessage ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Сталася помилка!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <FormControl isInvalid={!!formErrors.username} isRequired>
        <FormLabel>{"Введіть ім'я користувача"}</FormLabel>
        <Input placeholder="Ім'я користувача" {...registerField("username")} />
        <FormErrorMessage>{formErrors.username}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!formErrors.password} isRequired>
        <FormLabel>{"Введіть пароль"}</FormLabel>
        <HidePasswordInput
          placeholder="Ваш пароль"
          {...registerField("password")}
        />
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>
      <Stack
        direction={{ base: "column-reverse", lg: "row" }}
        align={{ base: "stretch", lg: "center" }}
        justifyContent="space-between"
      >
        <Text color="gray.500" size="sm">
          Вже маєте обліковий запис? Ви можете{" "}
          <NavLink href="/" color="teal.500">
            увійти
          </NavLink>{" "}
          в нього
        </Text>
        <Button
          isLoading={isSubmitting}
          variant="solid"
          colorScheme="teal"
          type="submit"
        >
          Продовжити
        </Button>
      </Stack>
    </Stack>
  );
};
