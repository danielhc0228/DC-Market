"use server";
import { z } from "zod";
import { PASSWORD_MIN_LENGTH /**PASSWORD_REGEX, PASSWORD_REGEX_ERROR**/ } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
// import { redirect } from "next/navigation";
// import getSession from "@/lib/session";
import LogUserIn from "@/lib/login";

const checkPasswords = ({
    password,
    confirm_password,
}: {
    password: string;
    confirm_password: string;
}) => password === confirm_password;

// const usernameSchema = z.string().min(5).max(10); // username must be a string of 5 letters minimum and 10 letters maximum.

const checkUsername = (username: string) => !username.includes("potato");

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string!",
                required_error: "Username is required",
            })
            .trim()
            .toLowerCase()
            //.transform((username) => `🔥 ${username}`) //change what's being typed to the formatted value. Changes value
            .refine(checkUsername, "No potatoes allowed!"), //restrict certain words to be contained
        email: z.string().email().toLowerCase(),
        password: z.string().min(PASSWORD_MIN_LENGTH), //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
    })
    .superRefine(async ({ username }, ctx) => {
        //superRefine() does not start validating other fields if this field is not validated.
        const user = await db.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        });
        if (user) {
            ctx.addIssue({
                code: "custom", //different custom code errors are available
                message: "This username is already taken",
                path: ["username"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true,
            });
            return z.NEVER;
        }
    })
    .refine(checkPasswords, {
        message: "Both passwords should be the same!",
        path: ["confirm_password"],
    });

export async function createAccount(prevState: unknown, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    const result = await formSchema.safeParseAsync(data); // or .spa
    if (!result.success) {
        return result.error.flatten();
    } else {
        // hash password
        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        // save the user to db
        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            },
        });
        console.log(user);
        // log the user in
        // const session = await getSession();
        // session.id = user.id;
        // await session.save();

        // // redirect "/profile"
        // redirect("/profile");
        LogUserIn(user.id);
    }
}
