"use client";

import {
    HomeIcon as SolidHomeIcon,
    NewspaperIcon as SolidNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
    VideoCameraIcon as SolidVideoCameraIcon,
    UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
    HomeIcon as OutlineHomeIcon,
    NewspaperIcon as OutlineNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
    VideoCameraIcon as OutlineVideoCameraIcon,
    UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
    const pathname = usePathname();
    return (
        <div className="fixed bottom-0 mx-auto grid w-full max-w-screen-md grid-cols-5 border-t border-neutral-600 px-5 py-3 *:text-white">
            <Link href="/products" className="flex flex-col items-center gap-px">
                {pathname === "/products" ? (
                    <SolidHomeIcon className="h-7 w-7" />
                ) : (
                    <OutlineHomeIcon className="h-7 w-7" />
                )}
                <span>Home</span>
            </Link>
            <Link href="/life" className="flex flex-col items-center gap-px">
                {pathname === "/life" ? (
                    <SolidNewspaperIcon className="h-7 w-7" />
                ) : (
                    <OutlineNewspaperIcon className="h-7 w-7" />
                )}
                <span>Life</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center gap-px">
                {pathname === "/chat" ? (
                    <SolidChatIcon className="h-7 w-7" />
                ) : (
                    <OutlineChatIcon className="h-7 w-7" />
                )}
                <span>Chat</span>
            </Link>
            <Link href="/live" className="flex flex-col items-center gap-px">
                {pathname === "/live" ? (
                    <SolidVideoCameraIcon className="h-7 w-7" />
                ) : (
                    <OutlineVideoCameraIcon className="h-7 w-7" />
                )}
                <span>Shopping</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-px">
                {pathname === "/profile" ? (
                    <SolidUserIcon className="h-7 w-7" />
                ) : (
                    <OutlineUserIcon className="h-7 w-7" />
                )}
                <span>My Carrots</span>
            </Link>
        </div>
    );
}
