"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, Suspense } from "react"; // Import Suspense here
import { useSearchParams, useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Index() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Wrap your page in Suspense */}
      <MainContent />
    </Suspense>
  );
}

function MainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toastShown, setToastShown] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if the user is authenticated
    const checkUserAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.info("You must register first to access the dashboard.", {
          toastId: 'error1',
        });
      }
      router.replace("/"); // You might want to redirect to a login page instead.
    };
    checkUserAuth();
  }, [searchParams, supabase, router, toastShown]);

  return (
    <main className="flex flex-col min-h-screen bg-slate-200">
      <section className="relative w-full h-screen">
        <Navbar />
        <video 
          src="/parliament.mp4" 
          autoPlay 
          muted 
          loop
          className="absolute inset-0 w-full h-full object-cover object-left" 
          style={{ objectPosition: '20% center' }} 
        />
        <div className="absolute top-32 sm:top-14 sm:left-20 p-2 sm:p-0">
          <h1 className="text-white text-5xl font-bold">Parliament Alor Gajah <br />Dashboard</h1>
          <p className="text-white mb-6">Enhancing data management for Alor Gajah's governance.</p>
          <Link href={"/protected/dashboard"} className="bg-blue-500 text-slate-50 justify-center text-center p-2 px-4 rounded-sm hover:bg-neutral-800">
            Get Started
          </Link>
        </div>
        <div className="absolute w-auto bottom-28 right-10 sm:right-32 p-2 sm:p-0">
          <p className="bg-black bg-opacity-40 p-2 rounded text-white">This system is designed to assist government <br /> 
            staff in streamlining administrative workflows and ensuring efficient <br /> data management.</p>
        </div>
      </section>
      <ToastContainer />
    </main>
  );
}
