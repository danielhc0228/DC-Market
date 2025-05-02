"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "en-AU"), //restricts to Australian mobile phone number
        "Wrong phone format",
    );

const tokenSchema = z.coerce.number().min(100000).max(999999); // token is string initially but 'coerce' forces type conversion to number.

interface ActionState {
    token: boolean;
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
            //else set token to true
            return {
                token: true,
            };
        }
    } else {
        // this code is run when the button is clicked again but this time token is set to true so it can be run.
        const result = tokenSchema.safeParse(token);
        if (!result.success) {
            //show error when verification code is incorrect
            return {
                token: true,
                error: result.error.flatten(),
            };
        } else {
            redirect("/"); //redirect to home screen if verfication code is correct
        }
    }
}
