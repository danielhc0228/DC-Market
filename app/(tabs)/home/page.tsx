import ProductWrapper from "@/components/product-wrapper";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath, unstable_cache } from "next/cache";

// this function uses cache to store data from db and allow it to be used without requesting to db again.
// 1st param: function to bring data
// 2nd param: key to store data as a cache
// 3rd param: optional param that refreshes cache when this function is accessed again after a set amount of time.
const getCachedProducts = unstable_cache(
    getInitialProducts,
    ["home-products"],
    // { revalidate: 60 }
);

async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
            isSold: true,
        },
        // take: 1,
        orderBy: {
            created_at: "desc",
        },
        // where: {
        //     isSold: false,
        // },
    });
    return products;
}

export const metadata = {
    title: "Home",
};

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
    const initialProducts = await getCachedProducts();
    const revalidate = async () => {
        "use server";
        revalidatePath("/home"); //it refreshes and gets new data for the WHOLE page. Bad if you only want to get new data for some.
    };
    return <ProductWrapper initialProducts={initialProducts} revalidate={revalidate} />;
}
