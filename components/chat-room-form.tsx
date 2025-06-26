import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const createChatRoom = async (productId: number) => {
    "use server";
    const session = await getSession();

    // Get product and seller
    const product = await db.product.findUnique({
        where: { id: productId },
        select: {
            userId: true,
        },
    });

    if (!product || product.userId === session.id) {
        // Prevent chatting with yourself or non-existing product
        redirect("/chats");
    }

    const sellerId = product.userId;

    // Check for existing room with same product and users
    const existingRoom = await db.chatRoom.findFirst({
        where: {
            productId,
            users: {
                every: {
                    id: {
                        in: [sellerId, session.id!],
                    },
                },
            },
        },
        select: { id: true },
    });

    if (existingRoom) {
        redirect(`/chats/${existingRoom.id}`);
    }

    // Create new room
    const newRoom = await db.chatRoom.create({
        data: {
            product: {
                connect: { id: productId },
            },
            users: {
                connect: [{ id: sellerId }, { id: session.id }],
            },
        },
        select: { id: true },
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
