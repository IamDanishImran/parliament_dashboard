import { resetPasswordAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ResetPassword({ searchParams }) {
  return (
    <form className="flex flex-col gap-4 mx-auto justify-center w-1/3 h-auto w-1/4 p-5 rounded bg-white border border-black [&>input]:mb-4">
      <div className="flex text-center justify-center items-center">
          <img src="/parliament_logo.svg" alt="logo-parliament" className=" w-68 h-24" />
        </div>
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="password">New password</Label>
      <Input
        type="password"
        name="password"
        placeholder="New password"
        required
      />
      <Label htmlFor="confirmPassword">Confirm password</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
      />
      <SubmitButton formAction={resetPasswordAction}>
        Reset password
      </SubmitButton>
      <Link href={"/"} className="bg-neutral-900 text-slate-50 justify-center text-center p-2 rounded-sm hover:bg-neutral-800">
        Back
      </Link>
      <FormMessage message={searchParams} />
    </form>
  );
}