"use server";
import { z } from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";

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
                required_error: "Username is required",
            })
            .trim()
            .toLowerCase()
            .transform((username) => `🔥 ${username}`) //change what's being typed to the formatted word
            .refine((username) => !username.includes("potato"), "No potatoes allowed!"), //restrict certain words to be contained
        email: z.string().email().toLowerCase(),
        password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirmPassword: z.string().min(PASSWORD_MIN_LENGTH),
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
