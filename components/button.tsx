"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
    text: string;
}

export default function Button({ text }: ButtonProps) {
    const { pending } = useFormStatus(); // need to use "use client" so cannot be used in page.tsx where the server action is held. Must be used in a separate component.
    return (
        <button disabled={pending} className="primary-btn h-10 disabled:cursor-not-allowed">
            {pending ? "Loading..." : text}
        </button>
    );
}
