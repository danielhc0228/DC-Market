// lib/actions/updateSoldStatus.ts
"use server";

import db from "@/lib/db";

export async function updateSoldStatus(formData: FormData) {
    const productId = Number(formData.get("productId"));
    await db.product.update({
        where: { id: productId },
        data: { isSold: true },
    });
}
