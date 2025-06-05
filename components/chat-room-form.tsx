import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const createChatRoom = async (id: number) => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
        data: {
            users: {
                connect: [{ id: id }, { id: session.id }],
            },
        },
        select: {
            id: true,
        },
    });

    redirect(`/chats/${room.id}`);
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
