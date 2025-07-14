"use client";

import Input from "@/components/input";
import { useActionState } from "react";
import { uploadPost } from "./actions";
import Button from "@/components/button";

export default function AddPost() {
    const [state, action] = useActionState(uploadPost, null);
    return (
        <div>
            Add New Post
            <form action={action}>
                <Input
                    name="title"
                    required
                    placeholder="Title"
                    type="text"
                    errors={state?.fieldErrors.title}
                ></Input>
                <Input
                    name="description"
                    required
                    placeholder="Description"
                    type="text"
                    errors={state?.fieldErrors.description}
                ></Input>
                <Button text="Submit" />
            </form>
        </div>
    );
}
