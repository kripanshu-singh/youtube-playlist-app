"use client";
import React from "react";
import { Button } from "./ui/moving-border";
import { signIn, signOut, useSession } from "next-auth/react";

export function MovingBorderDemo() {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-white  text-black  border-neutral-200"
        onClick={() => signIn("google")}
      >
        Sign in
      </Button>
    </div>
  );
}
