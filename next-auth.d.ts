import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    accessToken?: string;
  }
}

// src/types/next-auth.d.ts
// Extending NextAuth types to include additional profile fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }

  interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  }

  interface Profile {
    id: string;
    name: string | null;
    email: string | null;
    picture: string | null;
  }
}
