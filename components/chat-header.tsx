import Image from "next/image";
import Link from "next/link";
import { updateSoldStatus } from "@/lib/tradeSeverActions";

interface ChatHeaderProps {
    otherUser: {
        buyerId: number;
        username: string;
        avatar: string | null;
    };
    isSeller: boolean;
    productId: number;
    isSold: boolean;
    productTitle: string;
}

export default function ChatHeader({
    otherUser,
    isSeller,
    productId,
    isSold,
    productTitle,
}: ChatHeaderProps) {
    return (
        <div className="fixed top-0 left-0 z-10 flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
            <div className="flex gap-3">
                <Link href="/chat" className="text-orange-500 hover:text-orange-400">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </Link>
                <span className="block max-w-[200px] truncate text-xl font-semibold text-orange-400">
                    {productTitle}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Image
                    src={otherUser.avatar || "/avatar.png"}
                    alt={otherUser.username}
                    width={40}
                    height={40}
                    className="size-10 rounded-full"
                />
                <span className="text-xl font-semibold text-orange-400">{otherUser.username}</span>
            </div>
            {isSeller ? (
                !isSold ? (
                    <form action={updateSoldStatus}>
                        <input type="hidden" name="productId" value={productId} />
                        <input type="hidden" name="buyerId" value={otherUser.buyerId} />
                        <button className="rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-400">
                            Mark as Sold
                        </button>
                    </form>
                ) : (
                    <button className="rounded-md bg-gray-400 px-3 py-1 text-sm text-white">
                        Sold
                    </button>
                )
            ) : null}
        </div>
    );
}
