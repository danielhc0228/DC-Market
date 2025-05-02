"use server";
import { z } from "zod";

const checkPasswords = ({
    password,
    confirmPassword,
}: {
    password: string;
    confirmPassword: string;
}) => password === confirmPassword;

// const usernameSchema = z.string().min(5).max(10); // username must be a string of 5 letters minimum and 10 letters maximum.
const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string!",
                required_error: "Where is my username???",
            })
            .min(3, "Way too short!!!")
            .max(10, "That is too looooong!")
            .refine((username) => !username.includes("potato"), "No potatoes allowed!"),
        email: z.string().email(),
        password: z.string().min(10),
        confirmPassword: z.string().min(10),
    })
    .refine(checkPasswords, {
        message: "Both passwords should be the same!",
        path: ["confirmPassword"],
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
