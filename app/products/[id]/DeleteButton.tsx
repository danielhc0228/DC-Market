"use client";

import { deleteProduct } from "@/app/products/[id]/actions";

export default function DeleteButton({ id }: { id: number }) {
    const handleDelete = async () => {
        await deleteProduct(id); // assumes this is a server action with redirect
    };

    return (
        <button
            className="rounded-md bg-red-500 px-5 py-2.5 font-semibold text-white"
            onClick={handleDelete}
        >
            Delete product
        </button>
    );
}
