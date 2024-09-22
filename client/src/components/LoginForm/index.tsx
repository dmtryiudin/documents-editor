"use client";

import {
  Box,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { EmailPasswordLoginForm } from "../EmailPasswordLoginForm";
import { EnterTOTPCodeForm } from "../EnterTOTPCodeForm";
import { AuthFinished } from "../AuthFinished";

export const LoginForm = () => {
  const params = useSearchParams();

  const steps = [
    {
      title: "Дані для входу",
      description: "Ввести ім'я користувача та пароль",
    },
    { title: "Автентифікатор", description: "Ввести код з автентифікатору" },
    { title: "Готово!", description: "Тепер Ви можете користуватись системою" },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const step = params.get("step");
  const token = params.get("token");

  useEffect(() => {
    let resultStep = 0;

    switch (step) {
      case "1":
        if (token) {
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
      {activeStep === 0 ? <EmailPasswordLoginForm /> : null}
      {activeStep === 1 ? <EnterTOTPCodeForm /> : null}
      {activeStep === 2 ? <AuthFinished /> : null}
    </Stack>
  );
};
