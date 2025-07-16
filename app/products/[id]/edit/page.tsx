import { notFound } from "next/navigation";
import db from "@/lib/db";
import EditForm from "@/components/EditForm";

async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        select: {
            photo: true,
            title: true,
            price: true,
            description: true,
            id: true,
        },
    });
    return product;
}

interface ProductDetailProps {
    params: Promise<{ id: string }>;
}

export default async function EditPage(props: ProductDetailProps) {
    const params = await props.params;
    const id = Number(params.id);
    // if id is not number or not found in the db, lead to 404 page.
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }
    return <EditForm products={product} />;
}
