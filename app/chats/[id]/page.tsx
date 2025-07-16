import ChatHeader from "@/components/chat-header";
import ChatMessagesList from "@/components/chat-message-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { hasWrittenReview } from "@/lib/tradeSeverActions";
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

async function getUserProfile() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: {
            id: session.id!,
        },
        select: {
            username: true,
            avatar: true,
        },
    });
    return user;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id);
    const user = await getUserProfile();
    if (!user) {
        return notFound();
    }
    if (!room) {
        return notFound();
    }
    const initialMessages = await getMessages(params.id);
    const session = await getSession();

    // const chats = await getChats();
    const chatRoom = await db.chatRoom.findUnique({
        where: { id: params.id },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            product: {
                select: {
                    id: true,
                    title: true,
                    isSold: true,
                    userId: true, // seller
                },
            },
        },
    });

    if (!chatRoom) {
        notFound(); // or redirect("/404") if you want
    }

    const userId = session.id;
    const otherUser = chatRoom.users.find((u) => u.id !== userId)!;
    const isSeller = chatRoom.product.userId === userId;
    const isReviewed = await hasWrittenReview(chatRoom.product.id, userId!, otherUser.id);

    return (
        <div>
            <ChatHeader
                otherUser={{
                    buyerId: otherUser.id, //buyerId as this will only be used when the seller clicks the sold button.
                    username: otherUser.username,
                    avatar: otherUser.avatar,
                }}
                isSeller={isSeller}
                productId={chatRoom.product.id}
                productTitle={chatRoom.product.title}
                isSold={chatRoom.product.isSold}
            />
            <ChatMessagesList
                chatRoomId={params.id}
                userId={session.id!}
                initialMessages={initialMessages}
                username={user.username}
                avatar={user.avatar!}
                productId={chatRoom.product.id}
                isSold={chatRoom.product.isSold}
                isSeller={isSeller}
                isReviewed={isReviewed}
            />
        </div>
    );
}
