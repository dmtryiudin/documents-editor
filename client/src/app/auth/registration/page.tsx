import { RegistrationForm } from "@/components";
import { Suspense } from "react";

export default function RegistrationPage() {
  return (
    <Suspense>
      <RegistrationForm />
    </Suspense>
  );
}
