"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2am5ramFpcGRybmFpanlwYnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MTExNjYsImV4cCI6MjA2NTE4NzE2Nn0.2SYsLq0KnXtZrF9PIvwTlaxgUTHshIqNFCFGOga4kKQ";

const SUPABASE_URL = "https://avjnkjaipdrnaijypbyl.supabase.co";

interface ChatMessageListProps {
    initialMessages: InitialChatMessages;
    userId: number;
    chatRoomId: string;
}
export default function ChatMessagesList({
    chatRoomId,
    initialMessages,
    userId,
}: ChatMessageListProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [message, setMessage] = useState("");
    const channel = useRef<RealtimeChannel | null>(null); //useRef allows the channel constant to be used across functions and not rerender when changed and when rendered, its value will be the same.
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        setMessage(value);
    };

    // generate array of messages
    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setMessages((prevMsgs) => [
            ...prevMsgs,
            {
                id: Date.now(),
                payload: message,
                created_at: new Date(),
                userId,
                user: {
                    username: "string",
                    avatar: "xxx",
                },
            },
        ]);
        channel.current?.send({
            type: "broadcast",
            event: "message",
            payload: { message },
        });
        setMessage("");
    };

    // creates a unique channel between the seller and the buyer using SUPABASE
    useEffect(() => {
        const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
        channel.current = client.channel(`room-${chatRoomId}`);
        channel.current
            .on("broadcast", { event: "message" }, (payload) => {
                console.log(payload);
            })
            .subscribe(); // connect to the channel
        return () => {
            channel.current?.unsubscribe(); // clear function, disconnect from the channel
        };
    }, [chatRoomId]);

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
