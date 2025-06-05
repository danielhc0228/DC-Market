"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const commentSchema = z.object({
    payload: z
        .string({
            required_error: "payload is requried.",
        })
        .min(5),
    postId: z.string({
        required_error: "title is requried.",
    }),
});

export async function likePost(postId: number) {
    const session = await getSession();
    try {
        await db.like.create({
            data: {
                postId,
                userId: session.id!,
            },
        });
        revalidateTag(`like-status-${postId}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
}

export async function dislikePost(postId: number) {
    try {
        const session = await getSession();
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId: session.id!,
                },
            },
        });
        revalidateTag(`like-status-${postId}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadComment = async (_: any, formData: FormData) => {
    const data = {
        payload: formData.get("comment"),
        postId: formData.get("postId"),
    };
    const result = commentSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        try {
            const session = await getSession();
            const { id, created_at, payload, postId, updated_at, userId } = await db.comment.create(
                {
                    data: {
                        payload: result.data.payload,
                        post: {
                            connect: {
                                id: Number(result.data.postId),
                            },
                        },
                        user: {
                            connect: {
                                id: session.id,
                            },
                        },
                    },
                },
            );
            revalidateTag("post-detail");
            return { id, created_at, payload, postId, updated_at, userId };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
    }
};
