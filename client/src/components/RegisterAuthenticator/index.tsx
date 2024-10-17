"use client";

import { Button, Checkbox, Stack, Text, useBoolean } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";

export const RegisterAuthenticator: FC = () => {
  const params = useSearchParams();
  const totpUri = params.get("totpUri")!;

  const [value, { toggle }] = useBoolean();
  const router = useRouter();

  return (
    <Stack w="full" gap="5">
      <Stack gap="0">
        <Text fontSize="2xl">Зареєструйте автентифікатор</Text>
        <Text
          fontSize="sm"
          color="gray.500"
        >{`Автентифікатор — це 2FA-додаток, який генерує одноразові паролі (TOTP) для додаткового захисту облікових записів. Він створює код, що діє кілька секунд і потрібен для входу. Для реєстрації потрібно встановити додаток (Google Authenticator, Authy) і в налаштуваннях облікового запису активувати 2FA, відсканувавши QR-код.`}</Text>
      </Stack>
      <Stack direction="column" alignItems="center">
        <QRCodeSVG size={200} value={totpUri} />
        <Checkbox colorScheme="teal" isChecked={value} onChange={toggle}>
          Я підтверджую реєстрацію автентифікатора
        </Checkbox>
      </Stack>
      <Button
        isDisabled={!value}
        variant="solid"
        colorScheme="teal"
        alignSelf={{ lg: "flex-end" }}
        onClick={() => router.push("/auth/registration?step=2")}
      >
        Продовжити
      </Button>
    </Stack>
  );
};
