import { HidePasswordInput, NavLink } from "@/components";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Stack w="full" gap="5" as="form">
      <Text fontSize="3xl">Увійти в систему через обліковий запис</Text>
      <FormControl isRequired>
        <FormLabel>{"Введіть ім'я користувача"}</FormLabel>
        <Input placeholder="Ім'я користувача" />
        <FormHelperText>
          {"Необхідно ввести унікальне ім'я коритувача, а не Ваше власне"}
        </FormHelperText>
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
          Ще не маєте облікового запису? Ви можете{" "}
          <NavLink href="/" color="teal.500">
            створити
          </NavLink>{" "}
          його.
        </Text>
        <Button variant="solid" colorScheme="teal">
          Продовжити
        </Button>
      </Stack>
    </Stack>
  );
}
