import {
  LoadingSpinner,
  ProfileDataFormWrapper,
  ProtectedRoute,
} from "@/components";
import { Container } from "@chakra-ui/react";
import { Suspense } from "react";

async function SettingsPage() {
  return (
    <Container maxW="100%" h="100%" py="4">
      <Suspense fallback={<LoadingSpinner />}>
        <ProfileDataFormWrapper />
      </Suspense>
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
