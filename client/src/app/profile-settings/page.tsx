import { ProtectedRoute } from "@/components";
import { Container } from "@chakra-ui/react";

function SettingsPage() {
  return (
    <Container maxW="100%" h="100%" py="4">
      settings
    </Container>
  );
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  );
}
