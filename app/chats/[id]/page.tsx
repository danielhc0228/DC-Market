import ChatMessagesList from "@/components/chat-message-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
    const room = await db.chatRoom.findUnique({
        where: {
            id,
        },
        include: {
            users: {
                select: { id: true },
            },
        },
    });
    if (room) {
        const session = await getSession();
        const canSee = Boolean(room.users.find((user) => user.id === session.id!));
        if (!canSee) {
            return null;
        }
    }
    return room;
}

async function getMessages(chatRoomId: string) {
    const messages = await db.message.findMany({
        where: {
            chatRoomId,
        },
        select: {
            id: true,
            payload: true,
            created_at: true,
            userId: true,
            user: {
                select: {
                    avatar: true,
                    username: true,
                },
            },
        },
    });
    return messages;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: Promise<string> } }) {
    const id = await params.id;
    const room = await getRoom(id);
    if (!room) {
        return notFound();
    }
    const initialMessages = await getMessages(id);
    const session = await getSession();
    return (
        <ChatMessagesList chatRoomId={id} userId={session.id!} initialMessages={initialMessages} />
    );
}
