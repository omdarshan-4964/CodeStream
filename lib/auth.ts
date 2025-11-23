// lib/auth.ts

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type AuthOptions, type DefaultSession } from "next-auth";
import { getServerSession } from "next-auth/next";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// This adds the 'id' property to the session user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// Runtime environment variable check
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env"
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  callbacks: {
    // This callback is used to add the user's ID to the session token
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // token.sub is the user's ID
      }
      return session;
    },
  },
};

/**
 * A helper function to get the server-side session.
 * This replaces the 'auth()' helper we had in the route file.
 */
export const getAuthSession = () => getServerSession(authOptions);