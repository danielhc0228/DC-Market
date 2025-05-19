// app/products/actions.ts
"use server";

import { redirect } from "next/navigation";
import db from "@/lib/db";

export async function deleteProduct(id: number) {
    await db.product.delete({
        where: { id },
    });

    redirect("/products"); // ✅ This is valid inside a server action
}
