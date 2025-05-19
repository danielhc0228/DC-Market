"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
    const [state, dispatch] = useActionState(createAccount, null);
    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.username}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={state?.fieldErrors.email}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.password}
                />
                <Input
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    minLength={PASSWORD_MIN_LENGTH}
                    errors={state?.fieldErrors.confirm_password}
                />
                <Button text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}
