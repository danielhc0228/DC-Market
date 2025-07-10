"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import db from "@/lib/db";
import { promises as fs } from "fs";

// Profile validation schema
const profileSchema = z.object({
    username: z.string({
        required_error: "Username is required",
    }),
    email: z.string().email("Invalid email address"),
    avatar: z.string().optional(),
    id: z.coerce.number(),
});

// Edit profile handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function editProfile(_: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        avatar: formData.get("avatar"),
        id: formData.get("id"),
        originalAvatar: formData.get("originalAvatar"),
    };

    let avatarPath = data.originalAvatar;

    if (data.avatar instanceof File && data.avatar.name !== "") {
        const avatarData = await data.avatar.arrayBuffer();
        await fs.writeFile(`./public/${data.avatar.name}`, Buffer.from(avatarData));
        avatarPath = `/${data.avatar.name}`;
    }

    data.avatar = avatarPath;

    const result = profileSchema.safeParse(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if (session.id) {
            await db.user.update({
                where: { id: session.id },
                data: {
                    username: result.data.username,
                    email: result.data.email,
                    avatar: result.data.avatar || null,
                },
            });

            revalidatePath("/profile");
            redirect("/profile");
        }
    }
}
