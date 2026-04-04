import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import CredentialsSignInForm from "./credentials-signin-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <Card className="rounded-none border shadow-sm">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-4xl md:text-5xl font-black uppercase tracking-tight">
          SIGN UP OR LOG IN
        </CardTitle>
        <CardDescription className="text-base">
          Enter your email and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CredentialsSignInForm />
        <div className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/" className="underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
