// lib/actions/updateSoldStatus.ts
"use server";

import db from "@/lib/db";
import getSession from "./session";

export async function updateSoldStatus(formData: FormData) {
    const productId = Number(formData.get("productId"));
    const buyerId = Number(formData.get("buyerId"));
    await db.product.update({
        where: { id: productId },
        data: { isSold: true, buyerId: buyerId },
    });
}

export async function submitReview(formData: FormData) {
    const session = await getSession();
    const productId = Number(formData.get("productId"));
    const reviewerId = Number(formData.get("reviewerId"));
    const rating = Number(formData.get("rating"));
    const comment = String(formData.get("comment"));

    // Optional: check if user is buyer of this product
    const product = await db.product.findUnique({
        where: { id: productId },
        select: { userId: true, isSold: true },
    });

    if (!product || !product.isSold || product.userId == session.id) {
        throw new Error("Unauthorized or invalid review");
    }

    await db.review.create({
        data: {
            productId,
            reviewerId,
            revieweeId: product.userId,
            rating,
            comment,
        },
    });
}

export async function hasWrittenReview(productId: number, reviewerId: number, revieweeId: number) {
    const existingReview = await db.review.findFirst({
        where: {
            productId,
            reviewerId,
            revieweeId,
        },
        select: {
            id: true,
        },
    });

    return existingReview !== null;
}
