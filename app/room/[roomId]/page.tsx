// app/room/[roomId]/page.tsx

import { getAuthSession } from "@/lib/auth";
import RoomClient from "./RoomClient"; // Import our new component
import { redirect } from "next/navigation";

interface RoomPageProps {
  params: {
    roomId: string;
  };
}

// This is now a simple, fast Server Component
export default async function RoomPage({ params }: RoomPageProps) {
  // `params` may be a Promise in some Next.js runtime cases (RSC). Await it to be robust.
  const resolvedParams = (await params) as { roomId: string };

  const session = await getAuthSession();

  // 1. Protect the page
  if (!session?.user) {
    // You can customize this
    redirect("/api/auth/signin");
  }

  // 2. TODO: Fetch room data from Prisma
  // We should verify the user is allowed to be in this room.
  // For now, we'll just pass the data.

  // 3. Render the Client Component
  // We pass the data (roomId and session) as props
  return <RoomClient roomId={resolvedParams.roomId} session={session} />;
}