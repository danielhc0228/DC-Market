"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import { useActionState } from "react";

export default function CreateAccount() {
    const [state, dispatch] = useActionState(createAccount, null);
    return (
        <div className="flex flex-col gap-10 px-6 py-8">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">Hello!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <FormInput
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    errors={state?.fieldErrors.username}
                />
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={state?.fieldErrors.email}
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.fieldErrors.password}
                />
                <FormInput
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    errors={state?.fieldErrors.confirmPassword}
                />
                <FormButton text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}
