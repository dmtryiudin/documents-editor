import { Center, Spinner } from "@chakra-ui/react";

export const LoadingSpinner = () => {
  return (
    <Center h="100%">
      <Spinner color="teal.500" size="xl" />
    </Center>
  );
};
