import { LoadingSpinner, RegistrationForm } from "@/components";
import { Suspense } from "react";

export default function RegistrationPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegistrationForm />
    </Suspense>
  );
}
