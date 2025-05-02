"use server";
import { z } from "zod";

// const usernameSchema = z.string().min(5).max(10); // username must be a string of 5 letters minimum and 10 letters maximum.
const formSchema = z.object({
    username: z.string().min(3).max(10),
    email: z.string().email(),
    password: z.string().min(10),
    confirm_password: z.string().min(10),
});

export async function createAccount(prevState: unknown, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    }
}
