// app/api/rooms/[roomId]/join/route.ts
import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getAuthSession();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { roomId } = resolvedParams;

    // Fetch the room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { participants: true, owner: true },
    });

    // Room doesn't exist
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Check if user is already a participant or owner
    const isOwner = room.owner.id === session.user.id;
    const isAlreadyParticipant = room.participants.some(
      (p: { id: string }) => p.id === session.user.id
    );

    if (isOwner) {
      // Owner can always access
      return NextResponse.json({ success: true, message: "Owner access" });
    }

    if (isAlreadyParticipant) {
      // Already a participant
      return NextResponse.json({ success: true, message: "Already participant" });
    }

    // Add user as a participant
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        participants: {
          connect: { id: session.user.id },
        },
      },
      include: { participants: true },
    });

    return NextResponse.json({
      success: true,
      message: "Added as participant",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
