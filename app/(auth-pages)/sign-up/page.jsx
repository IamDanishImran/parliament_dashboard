"use client"; 
import { useSearchParams } from "next/navigation"; 
import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const searchParams = useSearchParams(); // Access search params
  const message = searchParams.get("message") || null; // Get message parameter
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission
    const formData = new FormData(event.target); // Collect form data
    
    try {
      await signUpAction(formData); // Assuming this function is handling the sign-up process
      toast.error("Failed to sign up. Please try again.");
    } catch (error) {
      toast.success("Sign up successful! Check your email for the verification link.");
    }
  };

  return (
    <main className="px-2 sm:p-0">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mx-auto justify-center h-auto w-full max-w-md p-5 rounded bg-white border border-black">
        <div id="title" className="col-span-full">
          <div className="flex text-center justify-center items-center">
            <img src="/parliament_logo.svg" alt="logo-parliament" className="w-68 h-24" />
          </div>
          <h1 className="text-2xl font-medium">Sign up</h1>
          <p className="text-sm text-foreground">
            Already have an account?{" "}
            <Link className="text-primary font-medium underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>

        <div id="form-input" className="grid grid-cols-1 gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your full name" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Your email" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="identification_number">IC Number</Label>
              <Input
                id="identification_number"
                name="identification_number"
                placeholder="Your IC number"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="register_code">Registration Role</Label>
              <select
                id="register_code"
                name="register_code"
                className="h-10 border rounded"
                required
              >
                <option value="">Choose</option>
                <option value="Rembia">Rembia</option>
                <option value="Machap Jaya">Machap Jaya</option>
                <option value="Durian Tunggal">Durian Tunggal</option>
                <option value="Asahan">Asahan</option>
                <option value="Gadek">Gadek</option>
                <option value="Outside Alor Gajah">Outside Alor Gajah</option>
                <option value="Outside Melaka">Outside Melaka</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
              Sign up
            </SubmitButton>
            <Link
              href="/"
              className="bg-neutral-900 text-slate-50 justify-center text-center p-2 rounded-sm hover:bg-neutral-800"
            >
              Back
            </Link>
          </div>
        </div>
      </form>
      <ToastContainer />
    </main>
  );
}

// import { signUpAction } from "@/app/actions";
// import { FormMessage } from "@/components/form-message";
// import { SubmitButton } from "@/components/submit-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";

// export default function Signup({ searchParams }) {
//   if ("message" in searchParams) {
//     return (
//       <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
//         <FormMessage message={searchParams} />
//       </div>
//     );
//   }

//   return (
//     <>
//       <form className="flex flex-col mx-auto justify-center h-3/5 w-1/5 p-5 rounded bg-orange-300">
//         <h1 className="text-2xl font-medium">Sign up</h1>
//         <p className="text-sm text-foreground">
//           Already have an account?{" "}
//           <Link className="text-primary font-medium underline" href="/sign-in">
//             Sign in
//           </Link>
//         </p>
//         <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
//           <Label htmlFor="email">Email</Label>
//           <Input name="email" placeholder="you@example.com" required />
//           <Label htmlFor="password">Password</Label>
//           <Input
//             type="password"
//             name="password"
//             placeholder="Your password"
//             minLength={6}
//             required
//           />
//           <SubmitButton formAction={signUpAction} pendingText="Signing up...">
//             Sign up
//           </SubmitButton>
//           <Link href={"/"} className="bg-neutral-900 text-slate-50 justify-center text-center p-2 rounded-sm hover:bg-neutral-800">
//             Back
//           </Link>
//           <FormMessage message={searchParams} />
//         </div>
//       </form>
//     </>
//   );
// }