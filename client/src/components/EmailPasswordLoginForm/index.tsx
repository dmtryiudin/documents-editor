"use client";

import { useSearchParams } from "next/navigation";
import { FC } from "react";
import { FormValues, LoginPayloadValidation } from "./types";
import { useFormValidation } from "@/hooks";
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
  Text,
} from "@chakra-ui/react";
import { HidePasswordInput } from "../HidePasswordInput";
import { NavLink } from "../NavLink";
import { submitForm } from "./actions";

export const EmailPasswordLoginForm: FC = () => {
  const params = useSearchParams();
  const errorMessage = params.get("errorMessage");

  const onSubmit = async (e: FormValues) => {
    await submitForm(e);
  };

  const { submitHandler, registerField, formErrors, isSubmitting } =
    useFormValidation<FormValues>(
      { username: "", password: "" },
      LoginPayloadValidation
    );

  return (
    <Stack w="full" gap="5" as="form" onSubmit={submitHandler(onSubmit)}>
      <Text fontSize="2xl">Увійти в обліковий запис</Text>
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
          Не маєте облікового запису? Ви можете{" "}
          <NavLink href="/" color="teal.500">
            створити
          </NavLink>{" "}
          його
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
