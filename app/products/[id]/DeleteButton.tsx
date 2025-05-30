"use client";

import { deleteProduct, revalidate } from "@/app/products/[id]/actions";

export default function DeleteButton({ id }: { id: number }) {
    const handleDelete = async () => {
        await deleteProduct(id); // assumes this is a server action with redirect
        revalidate();
    };

    return (
        <button
            className="cursor-pointer rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white hover:bg-red-400"
            onClick={handleDelete}
        >
            Delete product
        </button>
    );
}
