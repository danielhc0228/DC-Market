import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function SocialLogin() {
    return (
        <>
            <div className="h-px w-full bg-neutral-500" />
            <div className="flex flex-col gap-3">
                <Link
                    className="primary-btn flex h-10 items-center justify-center gap-2"
                    href="/github/start"
                >
                    <FaGithub className="size-6" />
                    <span>Continue with GitHub</span>
                </Link>
                <Link
                    className="primary-btn flex h-10 items-center justify-center gap-2"
                    href="/sms"
                >
                    <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
                    <span>Continue with SMS</span>
                </Link>
            </div>
        </>
    );
}
