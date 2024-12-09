import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="absolute w-full flex justify-center h-16 opacity-100 z-10">
      {/* w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm bg-slate-700 */}
      <div className="w-full w-7xl flex justify-between items-center py-3 px-20 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/">Parliament Dashboard</Link>
        </div>
        <div className="flex gap-10">
          <div>
            <p><Link href="/">Home</Link></p>
          </div>
          <div>
            <p><Link href="/about/">About Us</Link></p>
          </div>
          <div>
            <p><Link href="/contact/">Contact Us</Link></p>
          </div>
        </div>
        <div>
          <Button asChild size="sm" variant={"outline"} className="mr-1">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"} className="ml-1">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
