"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

// check if the type of the object is string or number
const productSchema = z.object({
    photo: z.string({
        required_error: "Photo is required",
    }),
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
    price: z.coerce.number({
        required_error: "Price is required",
    }),

    id: z.coerce.number(),
});

// Create object of photo, title, price and its description
// _: any is ActionState from page.tsx and formData is the product data sent through
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function editProduct(_: any, formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
        id: formData.get("id"),
        originalPhoto: formData.get("originalPhoto"),
    };

    // if the photo is File type, convert it to a buffer and save it into public folder.
    // Doing this for test purpose, to do it professionally, use Cloudflare images which needs payment.
    let photoPath = data.originalPhoto;

    if (data.photo instanceof File && data.photo.name !== "") {
        const photoData = await data.photo.arrayBuffer();
        await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
        photoPath = `/${data.photo.name}`;
    }

    data.photo = photoPath;

    // parse error-less data
    const result = productSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        // if there is no error, create new data to the database
        const session = await getSession();
        if (session.id) {
            const product = await db.product.update({
                where: { id: result.data.id },
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo,
                },
                // after creation, only id is returned
                select: {
                    id: true,
                },
            });
            revalidatePath("/home");
            revalidateTag("product-detail");
            revalidateTag("product-title");
            redirect(`/products/${product.id}`);
            //redirect("/products")
        }
    }
}
