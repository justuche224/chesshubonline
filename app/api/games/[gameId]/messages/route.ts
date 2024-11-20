import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherSever } from "@/lib/pusher";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const user = await currentUser();
    // console.log("user found", user);

    const { gameId } = await params;
    // console.log("gameId", gameId);

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    // console.log("message", message);

    if (!message || typeof message !== "string") {
      return new NextResponse("Invalid message", { status: 400 });
    }

    // Check if user is a participant in the game
    const game = await db.game.findUnique({
      where: {
        id: gameId,
        OR: [{ whitePlayerId: user.id }, { blackPlayerId: user.id }],
      },
    });

    if (!game) {
      return new NextResponse("Game not found or you're not a participant", {
        status: 404,
      });
    }

    // Create the message
    const newMessage = await db.message.create({
      data: {
        content: message,
        gameId: gameId,
        senderId: user.id,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Trigger Pusher event with the new message
    await pusherSever.trigger(`game-${gameId}`, "message", {
      id: newMessage.id,
      content: newMessage.content,
      gameId: newMessage.gameId,
      senderId: newMessage.senderId,
      createdAt: newMessage.createdAt,
      sender: {
        id: newMessage.sender.id,
        username: newMessage.sender.username,
        image: newMessage.sender.image,
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        gameId: newMessage.gameId,
        senderId: newMessage.senderId,
        createdAt: newMessage.createdAt,
        sender: {
          id: newMessage.sender.id,
          username: newMessage.sender.username,
          image: newMessage.sender.image,
        },
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
