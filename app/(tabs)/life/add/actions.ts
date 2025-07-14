"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadPost(_: any, formData: FormData) {
    const data = {
        title: formData.get("title"),
        description: formData.get("description"),
    };

    // parse error-less data
    const result = postSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        // if there is no error, create new data to the database
        const session = await getSession();
        if (session.id) {
            const post = await db.post.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    //connect the post to user who uploaded
                    user: {
                        connect: {
                            id: session.id,
                        },
                    },
                },
                // after creation, only id is returned
                select: {
                    id: true,
                },
            });
            revalidatePath("/life");
            redirect(`/posts/${post.id}`);
        }
    }
}
