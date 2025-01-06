"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams and useRouter
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Navbar from "@/components/Navbar";

export default function Index() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toastShown, setToastShown] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if the user is authenticated
    const checkUserAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.info("You must sign up or sign in to access this page.", {
          toastId: 'error1',
        });
      }
        router.replace("/");
    };
    checkUserAuth();
  }, [searchParams, supabase, router, toastShown]);

  return (
    <>
      <main className="flex flex-col min-h-screen bg-slate-200">
        <section className="relative w-full h-screen">
          <Navbar />

          <video
            src="/parliament.mp4"
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover transform"
          />
          <div className="absolute top-28 left-20">
            <h1 className="text-white text-5xl font-bold">Parliament Alor Gajah <br />Dashboard</h1>
            <p className="text-white">Administration Dashboard provider for Melacca Government </p>
            <button className="text-slate-950 bg-slate-50 hover:bg-blue-500 hover:text-slate-50 py-2 px-3 rounded mt-5">Get Started</button>
          </div>
          <div className="absolute bottom-28 right-20">
            <p className="text-white">
              Administration Dashboard provider for Melacca Government<br />
              Administration Dashboard provider for Melacca<br />
              Administration Dashboard provider<br />
            </p>
          </div>
        </section>

        <section className="flex justify-center items-center bg-slate-50 h-screen">
          <section className="flex w-4/5 h-80 ">
            <article className="h-full w-full mr-2 p-2">
              <div className="bg-indigo-300 h-full w-full rounded-lg">This</div>
            </article>
            <article className="flex flex-col h-full w-full ml-2 p-2">
              <div className="bg-indigo-500 h-32 w-full rounded-lg items-center justify-center">This</div>
              <div className="bg-indigo-700 h-32 w-full mt-4 rounded-lg items-center justify-center">Is</div>
              <div className="bg-indigo-900 h-32 w-full mt-4 rounded-lg items-center justify-center">Test</div>
            </article>
          </section>
        </section>
      </main>

      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </>
  );
}
