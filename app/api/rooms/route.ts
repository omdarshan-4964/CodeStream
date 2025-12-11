// app/api/rooms/route.ts

import { getAuthSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Check if user is authenticated
    const session = await getAuthSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get the room name and mode from the request body
    // We'll default to the user's name + "'s Room" if no name is given
    const body = await req.json();
    const roomName = body.name || `${session.user.name}'s Room`;
    const mode = body.mode || "code"; // Default to "code" mode
    const userId = session.user.id;

    // 3. Create the new room in the database
    const newRoom = await prisma.room.create({
      data: {
        name: roomName,
        mode,
        ownerId: userId, // Set the owner
        participants: {
          connect: {
            id: userId, // Automatically add the owner as a participant
          },
        },
      },
    });

    // 4. Return the new room's data (especially the ID)
    return NextResponse.json(newRoom, { status: 201 });
    
  } catch (error) {
    console.error("[ROOMS_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}