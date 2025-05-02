import { InputHTMLAttributes } from "react";

interface InputProps {
    errors?: string[];
    name: string;
}

export default function Input({
    errors = [],
    name,
    ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="h-10 w-full rounded-md border-none bg-transparent pl-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-3 focus:ring-orange-500 focus:outline-none"
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
