"use client";

import Input from "@/components/input";
import { useActionState } from "react";
import { uploadPost } from "./actions";
import Button from "@/components/button";
import Textarea from "@/components/textarea";

export default function AddPost() {
    const [state, action] = useActionState(uploadPost, null);

    return (
        <div className="flex min-h-screen justify-center px-1 py-8">
            <div className="w-full max-w-full rounded-2xl p-4 shadow-lg">
                <h2 className="mb-6 text-center text-2xl font-bold">Add New Post</h2>

                <form action={action} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium">
                            Title
                        </label>
                        <Input
                            name="title"
                            required
                            placeholder="Post Title"
                            type="text"
                            errors={state?.fieldErrors.title}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-1 block text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            name="description"
                            required
                            placeholder="Write something..."
                            errors={state?.fieldErrors.description}
                        />
                    </div>

                    <Button text="Submit" />
                </form>
            </div>
        </div>
    );
}
