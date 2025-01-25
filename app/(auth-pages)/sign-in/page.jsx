import { signInAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login({ searchParams }) {
  const errorMessage = searchParams?.error;
  const successMessage = searchParams?.success;
  return (
    <form className="p-2 flex flex-col mx-auto justify-center h-auto sm:w-1/4 sm:p-5 rounded rounded bg-white border border-black">
      <div className="flex text-center justify-center items-center">
        <img src="/parliament_logo.svg" alt="logo-parliament" className=" w-68 h-24" />
      </div>
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Registration Code</Label>
        <Input name="register_code" placeholder="xxx-xxx" required />

        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <Link href={"/"} className="bg-neutral-900 text-slate-50 justify-center text-center p-2 rounded-sm hover:bg-neutral-800">
          Back
        </Link>
        <FormMessage message={searchParams} />
        {/* Display error or success message from query params */}
        {errorMessage && <FormMessage message={errorMessage} />}
        {successMessage && <FormMessage message={successMessage} />}
      </div>
    </form>
  );
}


// import { signInAction } from "@/app/actions";
// import { FormMessage } from "@/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";

// export default function Login({ searchParams }) {
//   return (
//     <form className="flex flex-col mx-auto justify-center h-3/5 w-1/5 p-5 rounded bg-orange-300">
//       <h1 className="text-2xl font-medium">Sign in</h1>
//       <p className="text-sm text-foreground">
//         Don't have an account?{" "}
//         <Link className="text-foreground font-medium underline" href="/sign-up">
//           Sign up
//         </Link>
//       </p>
//       <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
//         <Label htmlFor="email">Email</Label>
//         <Input name="email" placeholder="you@example.com" required />
//         <div className="flex justify-between items-center">
//           <Label htmlFor="password">Password</Label>
//           <Link
//             className="text-xs text-foreground underline"
//             href="/forgot-password"
//           >
//             Forgot Password?
//           </Link>
//         </div>
//         <Input
//           type="password"
//           name="password"
//           placeholder="Your password"
//           required
//         />
//         <SubmitButton pendingText="Signing In..." formAction={signInAction}>
//           Sign in
//         </SubmitButton>
//         <Link href={"/"} className="bg-neutral-900 text-slate-50 justify-center text-center p-2 rounded-sm hover:bg-neutral-800">
//           Back
//         </Link>
//         <FormMessage message={searchParams} />
//       </div>
//     </form>
//   );
// }