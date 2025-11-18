// app/api/auth/[...nextauth]/route.ts

import { authOptions } from "@/lib/auth"; // Import our new options
import NextAuth from "next-auth";

// Create the handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };