"use client";
import { editProduct } from "@/app/products/[id]/edit/actions";
import { useActionState, useState } from "react";
import { z } from "zod";
import Input from "./input";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Button from "./button";
import Link from "next/link";

const fileSchema = z.object({
    // checks whether the uploaded file is image file
    type: z.string().refine((value) => value.startsWith("image/"), {
        message: "Only image files can be uploaded",
    }),

    // checks whether the uploaded file is exceeding 3MB
    size: z.number().refine((value) => value <= 3 * 1024 * 1024, {
        message: "Size must be less than 3MB",
    }),

    // Or this:
    // size: z.number().max(1024 * 1024 * 3, {
    //     message: "Size must be less than 3MB",
    // }),
});

interface ProductProps {
    products: {
        photo: string;
        title: string;
        description: string;
        price: number;
        id: number;
    };
}

export default function EditForm({ products }: ProductProps) {
    const [preview, setPreview] = useState(products.photo);
    // Retrieves error from EditProduct and sends product data to EditProduct
    const [state, action] = useActionState(editProduct, null);

    // Create img url when an image is uploaded
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if (!files) {
            return;
        }
        const file = files[0];

        // checks if the uploaded file passes the requirement, throw error otherwise.
        const result = fileSchema.safeParse(file);
        if (!result.success) {
            alert(
                result.error.flatten().fieldErrors.type || result.error.flatten().fieldErrors.size,
            );
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);
    };
    return (
        <div>
            <form action={action} className="flex flex-col gap-5 p-5">
                <input type={"hidden"} name="id" value={products.id} />
                <label
                    htmlFor="photo"
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {preview === "" ? (
                        <>
                            <PhotoIcon className="w-20" />
                            <div className="text-sm text-neutral-400">Add Photo</div>
                        </>
                    ) : (
                        <div className="text-2xl text-neutral-400">Change Photo</div>
                    )}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <input type="hidden" name="originalPhoto" value={products.photo} />
                <Input
                    name="title"
                    required
                    placeholder="Title"
                    type="text"
                    errors={state?.fieldErrors.title}
                    defaultValue={products.title}
                />
                <Input
                    name="price"
                    type="number"
                    required
                    placeholder="Price"
                    errors={state?.fieldErrors.price}
                    defaultValue={products.price}
                />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="Description"
                    errors={state?.fieldErrors.description}
                    defaultValue={products.description}
                />
                <Button text="Submit" />
            </form>
            <Link
                href="/home"
                className="fixed top-5 left-5 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <ArrowLeftIcon className="size-10" />
            </Link>
        </div>
    );
}
