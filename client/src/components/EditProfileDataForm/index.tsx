"use client";

import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EditProfileDataFormProps,
  EditProfileDataPayloadValidation,
  FormValues,
} from "./types";
import { deleteAccountHandler, submitForm } from "./actions";
import { useFormValidation, useServerActionClientRequest } from "@/hooks";
import { FC, useRef } from "react";
import { useToast } from "@chakra-ui/react";

export const EditProfileDataForm: FC<EditProfileDataFormProps> = ({
  session,
}) => {
  const params = useSearchParams();
  const errorMessage = params.get("errorMessage");
  const toast = useToast();
  const router = useRouter();

  const onSubmit = async (e: FormValues) => {
    const { isSuccess, redirectUrl } = await submitForm(e);

    if (isSuccess) {
      toast({
        title: "Успіх!",
        description: "Дані було успішно оновлено.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }

    router.push(redirectUrl);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteAccountAction = async () => {
    await deleteAccountHandler();
    onClose();
  };

  const { isLoading: isDeleteLoading, wrappedCallback: deleteHandler } =
    useServerActionClientRequest<void>(deleteAccountAction);
  const { submitHandler, registerField, formErrors, isSubmitting, formFields } =
    useFormValidation<FormValues>(
      {
        firstName: session?.user.firstName || "",
        lastName: session?.user.lastName || "",
      },
      EditProfileDataPayloadValidation
    );

  const cancelRef = useRef(null);

  const getCanUpdate = () => {
    const initialState = {
      firstName: session?.user.firstName || "",
      lastName: session?.user.lastName || "",
    };

    return JSON.stringify(initialState) !== JSON.stringify(formFields);
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Видалення облікового запису
            </AlertDialogHeader>

            <AlertDialogBody>
              Підтвердіть видалення облікового запису.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Скасувати
              </Button>
              <Button
                isLoading={isDeleteLoading}
                colorScheme="red"
                onClick={() => deleteHandler()}
                ml={3}
              >
                Підтвердити
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Stack w="full" gap="5" as="form" onSubmit={submitHandler(onSubmit)}>
        <Text fontSize="2xl">Змінити дані облікового запису</Text>
        {errorMessage ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Сталася помилка!</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}
        <FormControl isInvalid={!!formErrors.firstName}>
          <FormLabel>{"Ім'я"}</FormLabel>
          <Input placeholder="Ім'я" {...registerField("firstName")} />
          <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formErrors.lastName}>
          <FormLabel>{"Прізвище"}</FormLabel>
          <Input placeholder="Прізвище" {...registerField("lastName")} />
          <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
        </FormControl>
        <Stack
          direction={{ base: "column", lg: "row" }}
          justifyContent="space-between"
        >
          <Button
            w={{ base: "100%", lg: "fit-content" }}
            isLoading={isSubmitting}
            variant="solid"
            colorScheme="teal"
            type="submit"
            isDisabled={!getCanUpdate()}
          >
            Зберегти зміни
          </Button>
          <Button
            variant="solid"
            colorScheme="red"
            type="button"
            onClick={onOpen}
          >
            Видалити обліковий запис
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
