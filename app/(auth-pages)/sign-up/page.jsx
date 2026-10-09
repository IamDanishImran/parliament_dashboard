// app\(auth-pages)\sign-up\page.jsx
"use client";
import { Suspense, useState, useEffect } from "react";
import { signUpAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

function RegistrationSelect() {
  const [regs, setRegs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedCode, setSelectedCode] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    (async () => {
      try {
        const regResult = await supabase
          .from("registration")
          .select("id,role_code,description")
          .order("id", { ascending: true });

        const registrations = regResult?.data || [];
        const regError = regResult?.error;

        if (!mounted) return;

        if (regError) {
          console.error("registration fetch error:", regError);
          setLoadError(regError.message || "Unable to load registration list.");
          setRegs([]);
        } else if (!registrations.length) {
          setLoadError("No regions found in registration table.");
          setRegs([]);
        } else {
          setRegs(registrations);
        }
      } catch (err) {
        console.error("Unexpected error fetching registrations:", err);
        setLoadError(err?.message || String(err) || "Fetch failed");
        setRegs([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <select
        id="register_code"
        name="register_code"
        className="h-10 border rounded"
        required
        defaultValue=""
        disabled={isLoading || regs.length === 0}
        onChange={(e) => setSelectedCode(e.target.value)}
      >
        <option value="" disabled>
          {isLoading ? "Loading options..." : regs.length ? "Choose region" : "No regions available"}
        </option>
        {regs.map((r) => (
          <option key={r.role_code} value={r.role_code}>
            {r.description}
          </option>
        ))}
      </select>
      {loadError ? <p className="text-xs text-amber-600">{loadError}</p> : null}
      {!isLoading && selectedCode ? (
        <p className="text-xs text-slate-600">Selected role code: {selectedCode}</p>
      ) : null}
    </div>
  );
}

function SignupForm() {
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.target);
    const password = formData.get("password");

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    const result = await signUpAction(formData);

    if (result.status === "error") {
      toast.error(result.message);
      setIsSubmitting(false);
    } else {
      toast.success(result.message);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    }
  };

  if (!isClient) return null;

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
              <Label htmlFor="register_code">DUN Region</Label>
              <RegistrationSelect />
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </button>
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
