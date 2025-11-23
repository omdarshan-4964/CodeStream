// app/room/[roomId]/page.tsx
import { getAuthSession } from "@/lib/auth";
import RoomClient from "./RoomClient";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  // Resolve params which may be a Promise
  const resolvedParams = await params;
  const { roomId } = resolvedParams;

  // 1. Get authenticated session
  const session = await getAuthSession();

  // 2. Protect the page - only authenticated users can access
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // 3. CRITICAL: Verify the room exists and user is authorized
  // Also attempt to add user as participant if not already
  let room;
  try {
    room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { participants: true, owner: true },
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    redirect("/");
  }

  // Room doesn't exist
  if (!room) {
    redirect("/");
  }

  // Check if user is either the owner or a participant
  const isOwner = room.owner.id === session.user.id;
  const isParticipant = room.participants.some(
    (p) => p.id === session.user.id
  );

  // If not owner and not participant, try to add them
  if (!isOwner && !isParticipant) {
    try {
      // Add user as a participant
      await prisma.room.update({
        where: { id: roomId },
        data: {
          participants: {
            connect: { id: session.user.id },
          },
        },
      });
    } catch (error) {
      console.error("Error adding participant:", error);
      // If we can't add them, deny access
      redirect("/");
    }
  }

  // 4. Render the Client Component with data
  return <RoomClient roomId={roomId} session={session} />;
}