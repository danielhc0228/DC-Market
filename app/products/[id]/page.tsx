import { getSoldStatus } from "@/app/(tabs)/home/@modal/(..)products/[id]/page";
import DeleteButton from "@/app/products/[id]/DeleteButton";
import ChatRoomForm from "@/components/chat-room-form";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToDollar } from "@/lib/utils";
import { ArrowLeftIcon, ArrowPathIcon, UserIcon } from "@heroicons/react/24/solid";
import { revalidateTag, unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsOwner(userId: number) {
    const session = await getSession();
    if (session.id) {
        return session.id === userId;
    }
    return false;
}

async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });
    return product;
}

const getCachedProduct = unstable_cache(getProduct, ["product-detail"], {
    tags: ["product-detail", "xxxx"],
});

async function getProductTitle(id: number) {
    console.log("title");
    const product = await db.product.findUnique({
        where: {
            id,
        },
        select: {
            title: true,
        },
    });
    return product;
}

const getCachedProductTitle = unstable_cache(getProductTitle, ["product-title"], {
    tags: ["product-title", "xxxx"],
});

// this function generates metadata but requests data from db which allows product title to be a site's title.
export async function generateMetadata(props: ProductDetailProps) {
    const params = await props.params;
    const id = Number(params.id);
    const product = await getCachedProductTitle(id);
    return {
        title: product?.title,
    };
}

interface ProductDetailProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetail(props: ProductDetailProps) {
    const params = await props.params;
    const id = Number(params.id);

    // if id is not number or not found in the db, lead to 404 page.
    if (isNaN(id)) {
        return notFound();
    }
    // const product = await getProduct(id);
    const product = await getCachedProduct(id);
    const status = await getSoldStatus(id);
    if (!product) {
        return notFound();
    }
    const isOwner = await getIsOwner(product.userId);

    // this function revalidates cached data only for a certain tag.
    const revalidate = async () => {
        "use server";
        revalidateTag("product-detail");
        //revalidateTag("xxxx") this will revalidate all data with tag xxxx.
    };
    return (
        <div>
            <div className="relative aspect-square">
                <Image fill src={product.photo} alt={product.title} className="object-contain" />
            </div>
            <div className="flex items-center gap-3 border-b border-neutral-700 p-5">
                <div className="size-10 overflow-hidden rounded-full">
                    {product.user.avatar !== null ? (
                        <Image
                            src={product.user.avatar}
                            width={40}
                            height={40}
                            alt={product.user.username}
                        />
                    ) : (
                        <UserIcon />
                    )}
                </div>
                <div>
                    <h3>{product.user.username}</h3>
                </div>
            </div>
            <div className="mb-20 p-5">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <p>{product.description}</p>
            </div>
            <div className="fixed bottom-0 left-0 flex w-full items-center justify-between bg-neutral-800 p-5">
                <span className="text-xl font-semibold">${formatToDollar(product.price)}</span>
                {isOwner ? (
                    <>
                        <Link
                            href={`/products/${id}/edit`}
                            className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Edit
                        </Link>
                        <DeleteButton id={id} />

                        <form action={revalidate}>
                            <button className="cursor-pointer bg-transparent px-5 py-2.5 font-semibold text-white">
                                <ArrowPathIcon className="size-6" />
                            </button>
                        </form>
                    </>
                ) : status ? (
                    <button
                        disabled={true}
                        className="cursor-not-allowed rounded-md bg-zinc-600 px-5 py-2.5 font-semibold text-white"
                    >
                        Sold
                    </button>
                ) : (
                    <ChatRoomForm productId={product.id} />
                )}
            </div>
            <Link
                href="/home"
                className="fixed top-5 left-5 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <ArrowLeftIcon className="size-10" />
            </Link>
        </div>
    );
}

// this function generates static pages from pages that were dynamic pages.
// In order for this function to work, getSession must be commented out (not used) because getSession is dynamic.
// take note: this converts dynamic pages to static HTML pages so if there are 10000 pages, not a good idea to use this function.
// export async function generateStaticParams() {
//   const products = await db.product.findMany({
//     select: {
//       id: true,
//     },
//   });
//   return products.map((product) => ({ id: product.id + "" }));
// }
