import { pusherSever } from "@/lib/pusher";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import logger from "@/utils/logger";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { chatId } = await params;

  if (!chatId || typeof chatId !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid chat ID" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { message } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { success: false, error: "Invalid message" },
      { status: 400 }
    );
  }

  try {
    const conversation = await db.conversation.findFirst({
      where: {
        id: chatId,
        OR: [{ user1Id: user.id }, { user2Id: user.id }],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          error: "Conversation does not exist or you are not part of it",
        },
        { status: 404 }
      );
    }

    const newMessage = await db.conversationMessage.create({
      data: {
        senderId: user.id,
        conversationId: conversation.id,
        content: message,
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
    await pusherSever.trigger(conversation.id, "message:new", {
      id: newMessage.id,
      content: newMessage.content,
      senderId: newMessage.senderId,
      createdAt: newMessage.createdAt,
      sender: {
        id: newMessage.sender.id,
        username: newMessage.sender.username,
        image: newMessage.sender.image,
      },
    });
    revalidatePath("/inbox");
    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
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
    logger.error("Error creating message", {
      error,
      chatId,
      userId: user.id,
    });
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
