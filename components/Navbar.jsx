"use client"; // Mark this as a client-side component

import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  // State to manage the authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by looking for a token in localStorage
    const userToken = localStorage.getItem("authToken"); // Replace with your actual logic
    if (userToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Sign out function
  const handleSignOut = () => {
    // Remove the token or perform any sign-out logic
    localStorage.removeItem("authToken"); // Replace with your actual logic
    setIsLoggedIn(false);
  };

  return (
    <nav className="absolute w-full flex justify-center h-16 opacity-100 z-10">
      <article className="w-full w-7xl flex justify-end items-center py-3 px-20 text-sm">
        <div>
          {!isLoggedIn ? (
            <>
              <Button asChild size="sm" variant={"outline"} className="mr-1">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant={"default"} className="ml-1">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" variant={"default"} className="ml-1" onClick={handleSignOut}>
              Sign out
            </Button>
          )}
        </div>
      </article>
    </nav>
  );
}
