import {Divider} from "@nextui-org/divider";
import { useEffect, useState } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(null);
    useEffect(() => {
      setCurrentYear(new Date().getFullYear());
    }, []);
  return (
  <>
    <footer className="h-48 w-full py-5 flex flex-col gap-4 items-center justify-center">
      <Divider className="my-4" />
      <div className="flex gap-4 text-slate-600 text-center">
        <p>@Parliament Dashboard Alor Gajah {currentYear}</p>
      </div>
    </footer>
  </> 
  );
}