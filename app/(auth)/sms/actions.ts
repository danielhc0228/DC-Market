"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import crypto from "crypto";
import db from "@/lib/db";
import getSession from "@/lib/session";

const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "en-AU"), //restricts to Australian mobile phone number
        "Wrong phone format",
    );

const tokenSchema = z.coerce // token is string initially but 'coerce' forces type conversion to number.
    .number()
    .min(100000)
    .max(999999)
    .refine(tokenExists, "This token does not exist."); // tokenExists is async function, so this requires await when used. see line 109.

interface ActionState {
    token: boolean;
}

async function getToken() {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where: {
            token,
        },
        select: {
            id: true,
        },
    });
    if (exists) {
        return getToken();
    } else {
        return token;
    }
}

async function tokenExists(token: number) {
    const exists = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        },
        select: {
            id: true,
        },
    });
    return Boolean(exists);
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
    const phone = formData.get("phone");
    const token = formData.get("token");
    if (!prevState.token) {
        // if token is false (initially set to false), check for valid phone number
        const result = phoneSchema.safeParse(phone);
        // if invalid, show error
        if (!result.success) {
            return {
                token: false,
                error: result.error.flatten(),
            };
        } else {
            // delete all token related to the phone number previously
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: result.data,
                    },
                },
            });
            // create new token
            const token = await getToken();
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            // connects if there is existing user or create new user and connect
                            where: {
                                phone: result.data,
                            },
                            create: {
                                username: crypto.randomBytes(10).toString("hex"), // random 10 hex digit as a username.
                                phone: result.data,
                            },
                        },
                    },
                },
            });

            // following sends sms message to your phone number from Twilio. Monthly fee required so not implementing it now.
            // install twilio and add relevant info to env file for the following code to work.
            //
            // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            // await client.messages.create({
            //     body: `Your Karrot verification code is: ${token}`,
            //     from: process.env.TWILIO_PHONE_NUMBER!,
            //     to: process.env.MY_PHONE_NUMBER!,
            // });

            //else set token to true
            return {
                token: true,
            };
        }
    } else {
        // this code is run when the button is clicked again but this time token is set to true so it can be run.
        const result = await tokenSchema.spa(token);
        if (!result.success) {
            //show error when verification code is incorrect
            return {
                token: true,
                error: result.error.flatten(),
            };
        } else {
            // if verification is correct, find the associated user id then match with session id to log in.
            const token = await db.sMSToken.findUnique({
                where: {
                    token: result.data.toString(),
                },
                select: {
                    id: true,
                    userId: true,
                },
            });
            const session = await getSession();
            session.id = token!.userId;
            await session.save();
            await db.sMSToken.delete({
                //delete sms token as no longer needed
                where: {
                    id: token!.id,
                },
            });
            redirect("/profile"); //redirect to home screen if verfication code is correct
        }
    }
}
