import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import Link from "next/link";

// this function uses cache to store data from db and allow it to be used without requesting to db again.
// 1st param: function to bring data
// 2nd param: key to store data as a cache
// 3rd param: optional param that refreshes cache when this function is accessed again after a set amount of time.
const getCachedProducts = unstable_cache(getInitialProducts, ["home-products"], { revalidate: 60 });

async function getInitialProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true,
        },
        take: 1,
        orderBy: {
            created_at: "desc",
        },
    });
    return products;
}

export const metadata = {
    title: "Home",
};

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
    const initialProducts = await getCachedProducts();
    return (
        <div>
            <ProductList initialProducts={initialProducts} />
            <Link
                href="/products/add"
                className="fixed right-8 bottom-24 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
