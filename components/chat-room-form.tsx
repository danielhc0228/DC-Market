import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const createChatRoom = async (otherUserId: number) => {
    "use server";
    const session = await getSession();

    // Step 1: Check for existing room
    const existingRoom = await db.chatRoom.findFirst({
        where: {
            users: {
                every: {
                    id: {
                        in: [otherUserId, session.id!],
                    },
                },
            },
            AND: [
                {
                    users: {
                        some: {
                            id: session.id,
                        },
                    },
                },
                {
                    users: {
                        some: {
                            id: otherUserId,
                        },
                    },
                },
            ],
        },
        select: {
            id: true,
        },
    });

    if (existingRoom) {
        // Step 2: Redirect to existing room
        redirect(`/chats/${existingRoom.id}`);
    }

    // Step 3: Create new room if none exists
    const newRoom = await db.chatRoom.create({
        data: {
            users: {
                connect: [{ id: otherUserId }, { id: session.id }],
            },
        },
        select: {
            id: true,
        },
    });

    redirect(`/chats/${newRoom.id}`);
};

export default function ChatRoomForm({ productId }: { productId: number }) {
    return (
        <form action={createChatRoom.bind(null, productId)}>
            <button className="cursor-pointer rounded-md bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-400">
                Chat
            </button>
        </form>
    );
}
