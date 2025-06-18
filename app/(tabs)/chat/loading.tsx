import React from "react";

const SkeletonChatItem = () => (
    <div className="flex animate-pulse items-center rounded-xl bg-white p-4 shadow-md">
        {/* Avatar skeleton */}
        <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-full animate-pulse bg-gray-300" />
        </div>

        {/* Text content skeleton */}
        <div className="flex flex-col justify-center space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
    </div>
);

export default function ChatListSkeleton() {
    return (
        <div className="space-y-4 p-4">
            <h1 className="mb-6 text-2xl text-amber-50">Chats</h1>
            {[...Array(6)].map((_, i) => (
                <SkeletonChatItem key={i} />
            ))}
        </div>
    );
}
