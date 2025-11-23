// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getAuthSession } from "@/lib/auth";
import { SignInButton } from "./components/SignInButton";
import { UserNav } from "./components/UserNav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeStream v2",
  description: "Collaborative Code Editor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Safely attempt to get the session.
  // During build time, this might fail or return null, which is fine.
  let session = null;
  try {
    session = await getAuthSession();
  } catch (error) {
    console.warn("Could not fetch session in RootLayout (this is expected during build):", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Simple Header */}
            <header className="w-full border-b bg-background">
              <div className="container mx-auto flex h-16 items-center justify-between p-4">
                <div className="font-bold text-lg">CodeStream v2</div>
                
                {session?.user ? (
                  <UserNav
                    name={session.user.name ?? "User"}
                    email={session.user.email ?? "No Email"}
                    image={session.user.image ?? ""}
                  />
                ) : (
                  <SignInButton />
                )}
              </div>
            </header>

            {/* Main Page Content */}
            <main className="grow">{children}</main>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}