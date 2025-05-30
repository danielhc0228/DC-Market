// app/products/actions.ts
"use server";

import { redirect } from "next/navigation";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: number) {
    await db.product.delete({
        where: { id },
    });

    redirect("/products"); // ✅ This is valid inside a server action
}

export async function revalidate() {
    revalidatePath("/home"); //it refreshes and gets new data for the WHOLE page. Bad if you only want to get new data for some.
}
