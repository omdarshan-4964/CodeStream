// app/components/SignInButton.tsx
"use client"; // This must be a client component to use onClick

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"; // From Shadcn

export function SignInButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Sign in with Google
    </Button>
  );
}