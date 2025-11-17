// app/types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's database ID. */
      id: string;
    } & DefaultSession["user"]; // This keeps the default properties (name, email, image)
  }
}