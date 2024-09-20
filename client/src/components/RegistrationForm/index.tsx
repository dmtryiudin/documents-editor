"use client";

import {
  EmailPasswordRegistrationForm,
  RegisterAuthenticator,
  AuthFinished,
} from "@/components";
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
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const RegistrationForm = () => {
  const params = useSearchParams();

  const steps = [
    {
      title: "Дані для входу",
      description: "Ввести ім'я користувача та пароль",
    },
    { title: "Автентифікатор", description: "Зареєструвати автентифікатор" },
    { title: "Готово!", description: "Тепер Ви можете користуватись системою" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const step = params.get("step");
  const totpUri = params.get("totpUri");

  useEffect(() => {
    let resultStep = 0;

    switch (step) {
      case "1":
        if (totpUri) {
          resultStep = 1;
        }
        break;
      case "2":
        resultStep = 2;
        break;
    }

    setActiveStep(resultStep);
  }, [params]);

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
      </Stepper>
      {activeStep === 0 ? <EmailPasswordRegistrationForm /> : null}
      {activeStep === 1 ? <RegisterAuthenticator /> : null}
      {activeStep === 2 ? <AuthFinished /> : null}
    </Stack>
  );
};
