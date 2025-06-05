"use client";

import { useFormStatus } from "react-dom";

export default function CommentButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            name="comment-btn"
            className="rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-orange-500 focus:ring-2 focus:ring-orange-300 focus:outline-none"
        >
            {pending ? <span className="loading loading-bars loading-sm"></span> : "Submit"}
        </button>
    );
}
