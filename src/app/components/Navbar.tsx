"use client";

import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoginButton from "./LoginButton";
import { Profile } from "./ProfilePhoto";
import { AnimatedTooltip } from "./ui/animated-tooltip";

export function Navbar({ className }: { className?: string }) {
  const { data: session, status } = useSession();
  console.log(`\n ~ Navbar ~ session :- `, session?.user);

  const [active, setActive] = useState<string | null>(null);

  // if (status === "loading") return <p>Loading...</p>;
  // if (status === "unauthenticated") return <LoginButton />;

  // Ensure the session data matches the expected shape
  const tooltipData =
    session?.user && session.user.id
      ? {
          id: session.user.id,
          name: session.user.name || "Anonymous User",
          designation: "Member", // Provide a default designation
          image: session.user.image || "/default-avatar.png", // Fallback to a default avatar
        }
      : undefined;

  return (
    <div
      className={cn(
        "inset-x-0 max-w-2xl mx-auto z-50 h-[150px] flex flex-col justify-center",
        className,
      )}
    >
      <Menu setActive={setActive}>
        <HoveredLink href="/">Home </HoveredLink>
        <HoveredLink href="/about">About </HoveredLink>
        <HoveredLink href="/contact">Contact </HoveredLink>
        {tooltipData && <AnimatedTooltip item={tooltipData} />}
        <LoginButton />
      </Menu>
    </div>
  );
}
