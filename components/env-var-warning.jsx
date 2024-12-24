// @/components/env-var-warning.jsx
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const EnvVarWarning = () => {
  return (
    <div className="flex gap-4 items-center">
      <Badge variant={"outline"} className="font-normal">
        Supabase environment variables required
      </Badge>
      <div className="flex gap-2">
        <Button
          asChild
          size="sm"
          variant={"outline"}
          className="opacity-75 cursor-not-allowed pointer-events-none"
          disabled
        >
          <span aria-disabled="true">
            <Link href="/sign-in">Sign in</Link>
          </span>
        </Button>
        <Button
          asChild
          size="sm"
          variant={"default"}
          className="opacity-75 cursor-not-allowed pointer-events-none"
          disabled
        >
          <span aria-disabled="true">
            <Link href="/sign-up">Sign up</Link>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default EnvVarWarning;
