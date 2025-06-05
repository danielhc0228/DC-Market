"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

interface ChatMessageListProps {
    initialMessages: InitialChatMessages;
    userId: number;
}
export default function ChatMessagesList({ initialMessages, userId }: ChatMessageListProps) {
    const [messages] = useState(initialMessages);
    const [message, setMessage] = useState("");
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setMessage(value);
    };
    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert(message);
        setMessage("");
    };
    return (
        <div className="flex min-h-screen flex-col justify-end gap-5 p-5">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                        message.userId === userId ? "justify-end" : ""
                    }`}
                >
                    {message.userId === userId ? null : (
                        <Image
                            src={message.user.avatar!}
                            alt={message.user.username}
                            width={50}
                            height={50}
                            className="size-8 rounded-full"
                        />
                    )}
                    <div
                        className={`flex flex-col gap-1 ${
                            message.userId === userId ? "items-end" : ""
                        }`}
                    >
                        <span
                            className={`${
                                message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
                            } rounded-md p-2.5`}
                        >
                            {message.payload}
                        </span>
                        <span className="text-xs">
                            {formatToTimeAgo(message.created_at.toString())}
                        </span>
                    </div>
                </div>
            ))}
            <form className="relative flex" onSubmit={onSubmit}>
                <input
                    required
                    onChange={onChange}
                    value={message}
                    className="h-10 w-full rounded-full border-none bg-transparent px-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-4 focus:ring-neutral-50 focus:outline-none"
                    type="text"
                    name="message"
                    placeholder="Write a message..."
                />
                <button className="absolute right-0">
                    <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                </button>
            </form>
        </div>
    );
}
