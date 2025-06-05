"use client";

import { uploadComment } from "@/app/posts/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { Suspense, useActionState, useOptimistic } from "react";
import CommentButton from "./comment-button";
import Comments from "./comments";

interface CommentsProps {
    payload: string;
    id: number;
    created_at: Date;
    userId: number;
    user: {
        username: string;
        avatar: string | null;
    };
}

export default function CommentInput({
    id,
    sessionId,
    comments,
    // user,
}: {
    id: number;
    sessionId: number;
    comments: CommentsProps[];
    user: { username: string; avatar: string | null };
}) {
    //below code is used to show updated UI without waiting server to finish uploading
    const [optimisticState, reducerFn] = useOptimistic(
        comments,
        (previousComments, payload: CommentsProps) => [...previousComments, payload],
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptAction = async (_: any, formData: FormData) => {
        const newComment = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            payload: formData.get("comment")?.toString()!,
            id,
            created_at: new Date(),
            userId: sessionId,
            user: {
                username: "optimistic",
                avatar: null,
            },
        };

        reducerFn(newComment); // <--- Optimistic UI update
        formData.append("postId", id + ""); // postId is injected into formData
        return uploadComment(_, formData); // Calls the real backend function
    };

    const [, action] = useActionState(interceptAction, null);
    return (
        <div>
            <div className="mx-auto mt-8 mb-5 w-11/12 max-w-2xl px-4">
                <form
                    action={action}
                    className="flex w-full items-end gap-2 rounded-xl bg-white p-3 shadow-md ring-1 ring-gray-200"
                >
                    <textarea
                        name="comment"
                        placeholder="Write your comment..."
                        rows={1}
                        className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-black placeholder-gray-500 transition-all duration-200 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto"; // reset
                            target.style.height = target.scrollHeight + "px"; // grow
                        }}
                    />
                    <CommentButton />
                </form>
            </div>

            <Suspense
                fallback={<div>loading...</div>} //Use Suspense to show loading... when comments are loading
            >
                {optimisticState.map((comment) => (
                    <Comments
                        key={comment.id}
                        id={comment.id}
                        payload={comment.payload}
                        sessionId={sessionId}
                        user={comment.user}
                        userId={comment.userId}
                        createdAt={formatToTimeAgo(comment.created_at.toString())}
                    />
                ))}
            </Suspense>
        </div>
    );
}
