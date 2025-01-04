"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@nextui-org/skeleton";

export default function Header({ title }) {
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
      {loading ? (
        // Skeleton loader wrapping the whole header
        <Skeleton animated height="100%" width="100%" />
      ) : (
        <header className="bg-neutral-50 grid grid-rows-1 grid-flow-col w-full h-[120px] p-2 rounded shadow border border-gray-900">
          <article className="px-2 justify-end items-center w-full">
            <p className="text-sm font-medium">
              <span className="text-slate-600">Home</span> / {title}
            </p>
            <h1 className="text-3xl font-semibold mt-4">{title}</h1>
            <p className="font-semibold text-gray-700">Dashboard Parlimen Alor Gajah</p>
          </article>
          <article className="flex flex-col items-end justify-start w-full">
            <div className="bg-slate-50 border border-black rounded px-2 py-1 font-semibold">
              <p>{userDetails.name}</p>
            </div>
            <div className="bg-amber-300 text-amber-900 border border-black rounded px-2 py-1 mt-1 font-medium">
              <p>{userDetails.description}</p>
            </div>
          </article>
          </header>
      )}
    </>
  );
}
