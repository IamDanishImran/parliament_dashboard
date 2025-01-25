"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@nextui-org/skeleton";
import Breadcrumbs from "@mui/material/Breadcrumbs"; // Assuming you're using Material UI's Breadcrumbs component
import Link from "next/link"; // For navigation links in breadcrumbs

export default function Header({ title, navigator }) {
  const supabase = createClient();
  const [userDetails, setUserDetails] = useState({
    email: "Loading...",
    name: "Loading...",
    description: "Loading...",
  });
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setUserDetails({
            email: "Guest",
            name: "Guest",
            description: "No description available",
          });
          setLoading(false);
          return;
        }

        const userId = user.id;

        const { data: adminData } = await supabase
          .from("admin")
          .select("name, id_register")
          .eq("user_id", userId)
          .single();

        if (adminData) {
          const { data: registrationData } = await supabase
            .from("registration")
            .select("description")
            .eq("id", adminData.id_register)
            .single();

          setUserDetails({
            email: user.email,
            name: adminData.name,
            description: registrationData?.description || "No description found",
          });
          setLoading(false);
          return;
        }

        const { data: dunData } = await supabase
          .from("dun")
          .select("name, id_register")
          .eq("user_id", userId)
          .single();

        if (dunData) {
          const { data: registrationData } = await supabase
            .from("registration")
            .select("description")
            .eq("id", dunData.id_register)
            .single();

          setUserDetails({
            email: user.email,
            name: dunData.name,
            description: registrationData?.description || "No description found",
          });
          setLoading(false);
          return;
        }

        setUserDetails({
          email: user.email,
          name: "Name not found",
          description: "No description available",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        setUserDetails({
          email: "Error retrieving email",
          name: "Error retrieving name",
          description: "Error retrieving description",
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  return (
    <>
        <Skeleton isLoaded={!loading}>
        <header className="w-full h-full p-2 rounded border border-gray-900 shadow
          sm:grid sm:grid-rows-1 sm:grid-flow-col sm:w-full sm:h-[120px] sm:p-2 sm:rounded sm:shadow sm:border sm:border-gray-900">
          <article className="mb-4 sm:mb-0 px-2 flex flex-col items-center sm:items-start w-full">
  <div className="flex justify-end sm:justify-start w-full">
    <Breadcrumbs aria-label="breadcrumb" separator="›">
      <Link href="/" className="text-slate-600">
        Home
      </Link>
      <p className="text-sm font-medium text-neutral-900">{navigator}</p>
    </Breadcrumbs>
  </div>
  <h1 className="text-center sm:text-left text-3xl font-semibold mt-4">
    {title}
  </h1>
  <p className="text-center sm:text-left font-semibold text-gray-700">
    Parliament Dashboard Alor Gajah
  </p>
</article>

          <article className="hidden sm:inline flex-col sm:flex sm:flex-col sm:items-end sm:justify-start sm:w-full">
            <div className="bg-slate-50 border border-black rounded px-2 py-1 font-semibold">
              <p>{userDetails.name}</p>
            </div>
            <div className="bg-amber-300 text-amber-900 border border-black rounded px-2 py-1 mt-1 font-medium">
              <p>{userDetails.description}</p>
            </div>
          </article>
        </header>
        </Skeleton>
    </>
  );
}
