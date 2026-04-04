"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

/*sign in button component */
const SignUpButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="w-full h-12 rounded-none bg-[#e31837] hover:bg-[#c7122f]"
      variant="default"
    >
      {pending ? "Submitting..." : "Sign Up"}
    </Button>
  );
};

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
            className="h-12 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
            className="h-12 rounded-none"
          />
          <div className="mt-2 text-xs text-muted-foreground">
            For example, name@example.com
          </div>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
            className="h-12 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
            className="h-12 rounded-none"
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-center">
          <Link
            href={callbackUrl}
            className="text-sm font-semibold text-[#e31837] hover:underline underline-offset-4"
          >
            Continue As Guest
          </Link>
        </div>

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            target="_self"
            className="font-semibold text-[#e31837] hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
