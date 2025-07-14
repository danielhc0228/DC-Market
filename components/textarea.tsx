import TextareaAutosize from "react-textarea-autosize";
import { TextareaAutosizeProps } from "react-textarea-autosize";

interface TextareaProps {
    name: string;
    errors?: string[];
}

export default function Textarea({
    name,
    errors = [],
    ...rest
}: TextareaProps & TextareaAutosizeProps) {
    return (
        <div className="flex flex-col gap-2">
            <TextareaAutosize
                name={name}
                className="min-h-[100px] w-full resize-none rounded-md border-none bg-white p-4 text-black ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-4 focus:ring-orange-500 focus:outline-none"
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
