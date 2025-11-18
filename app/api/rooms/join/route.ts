// app/api/rooms/join/route.ts
import { getAuthSession } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getAuthSession();

  // 1. Check if user is authenticated
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { roomId } = body;

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    // 2. Find the room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return new NextResponse("Room not found", { status: 404 });
    }

    // 3. Add the user to the room's participant list
    await prisma.room.update({
      where: { id: roomId },
      data: {
        participants: {
          // 'connect' adds a relation, but only if it's not already there.
          // This prevents adding the same user multiple times.
          connect: { id: session.user.id },
        },
      },
    });

    // 4. Return success
    return NextResponse.json({ message: "Joined successfully" }, { status: 200 });

  } catch (error) {
    console.error("[JOIN_ROOM_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}