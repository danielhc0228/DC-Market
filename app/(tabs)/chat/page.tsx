import db from "@/lib/db";
import getSession from "@/lib/session";
import Image from "next/image";
import Link from "next/link";

export async function getChats() {
    const session = await getSession(); // get logged-in user

    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: session.id, // only include chat rooms with current user
                },
            },
        },
        select: {
            id: true,
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            messages: {
                orderBy: {
                    created_at: "desc", // newest first
                },
                take: 1, // only latest message
                select: {
                    payload: true,
                    created_at: true,
                },
            },
            updated_at: true,
            product: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            updated_at: "desc",
        },
    });

    return chatRooms;
}

export default async function Chat() {
    const chats = await getChats();
    const session = await getSession();
    return (
        <div className="flex flex-col gap-[5px] p-4">
            <h1 className="mb-6 text-2xl text-amber-50">Chats</h1>

            {chats.map((chat) => {
                const otherUser = chat.users.find((user) => user.id !== session.id!);
                const latestMessage = chat.messages[0]?.payload ?? "No messages yet";

                return (
                    <Link href={`/chats/${chat.id}`} key={chat.id}>
                        <div className="flex items-center rounded-xl bg-white p-4 shadow-md transition hover:bg-gray-50">
                            <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                                <Image
                                    src={otherUser?.avatar || "/avatar.png"}
                                    alt={otherUser?.username || ""}
                                    width={20}
                                    height={20}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-col justify-center">
                                <div className="flex flex-wrap items-center gap-3 text-lg font-semibold text-gray-900">
                                    <span className="text-orange-500">{otherUser?.username}</span>
                                    <span className="font-normal text-gray-400">|</span>
                                    <span className="truncate text-gray-700">
                                        {chat.product.title}
                                    </span>
                                </div>

                                <div className="max-w-[250px] truncate text-sm text-gray-600">
                                    {latestMessage}
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
