"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import { z } from "zod";
import { uploadProduct } from "./actions";

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

export default function AddProduct() {
    const [preview, setPreview] = useState("");

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

    // Retrieves error from uploadProduct and sends product data to uploadProduct
    const [state, action] = useActionState(uploadProduct, null);
    return (
        <div>
            <form action={action} className="flex flex-col gap-5 p-5">
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
                            <div className="text-sm text-neutral-400">사진을 추가해주세요.</div>
                        </>
                    ) : null}
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <Input
                    name="title"
                    required
                    placeholder="제목"
                    type="text"
                    errors={state?.fieldErrors.title}
                />
                <Input
                    name="price"
                    type="number"
                    required
                    placeholder="가격"
                    errors={state?.fieldErrors.price}
                />
                <Input
                    name="description"
                    type="text"
                    required
                    placeholder="자세한 설명"
                    errors={state?.fieldErrors.description}
                />
                <Button text="작성 완료" />
            </form>
        </div>
    );
}
