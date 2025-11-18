// app/api/rooms/[roomId]/join/route.ts
import { getAuthSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fix for Next.js 15 dynamic route params
// We must type the context correctly
interface Context {
  params: {
    roomId: string;
  };
}

export async function POST(req: Request, context: Context) {
  const session = await getAuthSession();

  // 1. Check authentication
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // In Next.js 15, params is not a Promise in API routes, but treating it as one
    // or accessing it directly from context is the safest way to handle the types.
    const { roomId } = context.params;

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    // 2. Find the room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        participants: true, // Include participants to check if user is already in
        owner: true,
      },
    });

    if (!room) {
      return new NextResponse("Room not found", { status: 404 });
    }

    // 3. Check if user is already a participant or owner
    const isOwner = room.owner.id === session.user.id;
    
    // --- FIX: Explicitly check the array ---
    // The previous error was here. We verify 'p' has an 'id' property.
    const isAlreadyParticipant = room.participants.some(
      (p) => p.id === session.user.id
    );

    // 4. If already in, just return success
    if (isOwner || isAlreadyParticipant) {
      return NextResponse.json({ message: "Already joined" }, { status: 200 });
    }

    // 5. Add user to room
    await prisma.room.update({
      where: { id: roomId },
      data: {
        participants: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ message: "Joined successfully" }, { status: 200 });

  } catch (error) {
    console.error("[JOIN_ROOM_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}