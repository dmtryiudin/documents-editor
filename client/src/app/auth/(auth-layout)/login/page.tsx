import { LoadingSpinner, LoginForm } from "@/components";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
