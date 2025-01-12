import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/youtube.readonly",
          response_type: "code",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;

        console.log(`\n ~ jwt ~ token.user :- `, token.user);
        token.user = {
          id: profile?.sub,
          name: profile?.name,
          email: profile?.email,
          image: profile?.picture,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
