import { InputHTMLAttributes } from "react";

interface InputProps {
    name: string;
    errors?: string[];
}

export default function Input({
    name,
    errors = [],
    ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="h-10 w-full rounded-md border-none bg-white pl-5 text-black ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-4 focus:ring-orange-500 focus:outline-none"
                {...rest}
            />
            {errors.map((error, index) => (
                <span key={index} className="font-medium text-red-500">
                    {error}
                </span>
            ))}
        </div>
    );
}
