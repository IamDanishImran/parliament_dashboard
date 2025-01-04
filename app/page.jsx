
// C:\Users\User\parlimen\app\page.jsx
// import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
// import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import HeaderAuth from "@/components/header-auth";
import { ThemeProvider } from "next-themes";
import Link from "next/link";

import Navbar from "@/components/Navbar";

export default async function Index() {
  return (
    <>
      <main className="flex flex-col min-h-screen bg-slate-200">
        <section className="relative w-full h-screen">
        {/* Header Navigator */}
        {/* <ThemeProvider>
          <nav className="absolute w-full flex justify-center border-b border-b-foreground/10 h-16  opacity-100 z-10">
            <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <Link href={"/"}>Parliament Dashboard</Link>
                <div className="flex items-center gap-2"></div>
              </div>
              <div className="flex gap-10">
                <div><p><a href="#">Home</a></p></div>
                <div><p><a href="#">About Us</a></p></div>
                <div><p><a href="#">Contact Us</a></p></div>
              </div>
              <HeaderAuth /> 
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} // Comment
            </div>
          </nav>
          </ThemeProvider> */}
          
          <Navbar /> {/* Use the Navbar component */}z

          <video
          src="/parliament.mp4"
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover transform"
          />
          {/* <img src="/parliament1.png" alt="" className="absolute inset-0 w-full h-full object-cover transform"/> */}
          <div className="absolute top-28 left-20">
            <h1 className="text-white text-5xl font-bold">Parliament Alor Gajah <br />Dashboard</h1>
            <p className="text-white">Administration Dashboard provider for Melacca Goverment </p>
            <button className="text-slate-950 bg-slate-50 hover:bg-blue-500 hover:text-slate-50 py-2 px-3 rounded mt-5">Get Started</button>
          </div>
          <div className="absolute bottom-28 right-20">
            <p className="text-white">
              Administration Dashboard provider for Melacca Goverment<br />
              Administration Dashboard provider for Melacca<br />
              Administration Dashboard provider<br />
              </p>
          </div>
        </section>
        <section className="flex justify-center items-center bg-slate-50 h-screen">
          <section className="flex w-4/5 h-80 ">
            <article className=" h-full w-full mr-2 p-2">
              <div className="bg-indigo-300 h-full w-full rounded-lg">This</div>
            </article>
            <article className="flex flex-col  h-full w-full ml-2 p-2">
              <div className="bg-indigo-500 h-32 w-full rounded-lg items-center justify-center">This</div>
              <div className="bg-indigo-700 h-32 w-full mt-4 rounded-lg items-center justify-center">Is</div>
              <div className="bg-indigo-900 h-32 w-full mt-4 rounded-lg items-center justify-center">Test</div>
            </article>
          </section>
        </section>
      </main>
    </>
  );
}