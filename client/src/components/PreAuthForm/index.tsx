import { HidePasswordInput, NavLink } from "@/components";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { FC, FormEventHandler } from "react";
import { PreAuthFormProps } from "./types";

export const PreAuthForm: FC<PreAuthFormProps> = ({ onSubmit, isLoading }) => {
  const submitHandler: FormEventHandler<HTMLDivElement> = (e) => {
    console.log(e);
  };

  return (
    <Stack w="full" gap="5" as="form" onSubmit={submitHandler}>
      <Text fontSize="3xl">Створити обліковий запис</Text>
      <FormControl isInvalid={true} isRequired>
        <FormLabel>{"Введіть ім'я користувача"}</FormLabel>
        <Input placeholder="Ім'я користувача" />
        <FormErrorMessage>Test message</FormErrorMessage>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>{"Введіть пароль"}</FormLabel>
        <HidePasswordInput placeholder="Ваш пароль" />
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
        <Button variant="solid" colorScheme="teal" type="submit">
          Продовжити
        </Button>
      </Stack>
    </Stack>
  );
};
