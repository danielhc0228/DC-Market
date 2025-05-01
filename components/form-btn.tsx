"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
    text: string;
}

export default function FormButton({ text }: FormButtonProps) {
    const { pending } = useFormStatus(); // need to use "use client" so cannot be used in page.tsx where the server action is held. Must be used in a separate component.
    return (
        <button disabled={pending} className="primary-btn h-10 disabled:cursor-not-allowed">
            {pending ? "Loading..." : text}
        </button>
    );
}
