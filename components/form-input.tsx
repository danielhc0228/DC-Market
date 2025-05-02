interface FormInputProps {
    type: string;
    placeholder: string;
    required: boolean;
    errors?: string[];
    name: string;
}

export default function FormInput({
    type,
    placeholder,
    required,
    errors = [],
    name,
}: FormInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="h-10 w-full rounded-md border-none bg-transparent pl-5 ring-2 ring-neutral-200 transition placeholder:text-neutral-400 focus:ring-3 focus:ring-orange-500 focus:outline-none"
                type={type}
                placeholder={placeholder}
                required={required}
            />
            {errors.map((error, index) => (
                <span key={index} className="font-medium text-red-500">
                    {error}
                </span>
            ))}
        </div>
    );
}
