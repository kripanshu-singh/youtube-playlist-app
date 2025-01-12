"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <button
          className="px-8 py-2 rounded-full bg-gradient-to-b from-red-500 to-red-600 text-white focus:ring-2 focus:ring-red-400 hover:shadow-xl transition duration-200"
          onClick={() => signOut()}
        >
          Sign out
        </button>
        {/* <button onClick={() => signOut()} style={{ color: "red" }}>
          Sign out
        </button> */}
      </>
    );
  }

  return (
    <button
      className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
      onClick={() => signIn("google")}
    >
      Sign in
    </button>
  );

  // <button onClick={() => signIn("google")}>Sign in with Google</button>;
};

export default LoginButton;
