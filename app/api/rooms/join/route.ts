// app/api/rooms/join/route.ts
import { getAuthSession } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  // 1. Check authentication
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { roomId } = await req.json();

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