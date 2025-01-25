import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Parliament Alor Gajah Dashboard", // "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children, params }) {
  // Check if the current segment is an auth or protected page
  const isAuthPage = params?.segment === "(auth-pages)" || params?.segment === "protected";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-950 text-foreground min-h-screen">
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col gap-0 items-center">
            <div className="flex flex-col w-full h-full">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}





// import HeaderAuth from "@/components/header-auth";
// import { hasEnvVars } from "@/utils/supabase/check-env-vars";
// import { GeistSans } from "geist/font/sans";
// import { ThemeProvider } from "next-themes";
// import Link from "next/link";
// import "./globals.css";

// import Navbar from "@/components/Navbar";

// const defaultUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "http://localhost:3000";

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Next.js and Supabase Starter Kit",
//   description: "The fastest way to build apps with Next.js and Supabase",
// };

// export default function RootLayout({ children, params }) {
//   const isAuthPage = params?.segment === "(auth-pages)"; // Check if route is an auth page
//   return (
//     <html lang="en" className={GeistSans.className} suppressHydrationWarning>
//       <body className="bg-neutral-950 text-foreground min-h-screen">
//         <main className="min-h-screen flex flex-col items-center">
//           <div className="flex-1 w-full flex flex-col gap-0 items-center">

//             {/* <ThemeProvider>
//             <nav className="absolute w-full flex justify-center border-b border-b-foreground/10 h-16  opacity-100 z-10">
//               <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
//                 <div className="flex gap-5 items-center font-semibold">
//                   <Link href={"/"}>Parliament Dashboard</Link>
//                   <div className="flex items-center gap-2"></div>
//                 </div>
//                 <div className="flex gap-10">
//                   <div><p><a href="#">Home</a></p></div>
//                   <div><p><a href="#">About Us</a></p></div>
//                   <div><p><a href="#">Testing Nav</a></p></div>
//                 </div>
//                 <HeaderAuth /> 
//                 {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} // Standbby
//                 // {hasEnvVars ? <HeaderAuth /> : <EnvVarWarning />}
//               </div>
//             </nav>
//             </ThemeProvider> */}
//             <Navbar /> {/* Use the Navbar component */}
//             {!isAuthPage && <Navbar />} {/* Only show Navbar if not an auth page */}
//             <div className="flex flex-col w-full h-full">
//               {children}
//             </div>
//           </div>
//         </main>
//       </body>
//     </html>
//   );
// }