"use client";

import { PreAuthForm } from "@/components";
import {
  Box,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from "@chakra-ui/react";

export default function RegistrationPage() {
  const steps = [
    {
      title: "Дані для входу",
      description: "Ввести ім'я користувача та пароль",
    },
    { title: "Автентифікатор", description: "Зареєструвати автентифікатор" },
    { title: "Готово!", description: "Тепер ви можете користуватись системою" },
  ];

  const { activeStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const preAuthFormSubmitHandler = (username: string, password: string) => {
    console.log({ username, password });
  };

  return (
    <Stack>
      <Stepper
        display={{ base: "none", lg: "flex" }}
        colorScheme="teal"
        index={activeStep}
        size="sm"
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>{" "}
      {activeStep === 0 ? (
        <PreAuthForm onSubmit={preAuthFormSubmitHandler} />
      ) : null}
    </Stack>
  );
}
