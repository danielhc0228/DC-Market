"use server";

import DeleteButton from "@/app/products/[id]/DeleteButton";
import CloseButton from "@/components/close-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollLockWrapper from "./ScrollLock";

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

export default async function Modal({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    // if id is not number or not found in the db, lead to 404 page.
    if (isNaN(id)) {
        return notFound();
    }
    const product = await getProduct(id);
    if (!product) {
        return notFound();
    }

    const isOwner = await getIsOwner(product.userId);
    return (
        <ScrollLockWrapper>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 sm:px-0">
                <div className="relative w-full max-w-2xl rounded-xl bg-neutral-900 text-neutral-100 shadow-2xl">
                    {/* Close Button */}
                    <div className="fixed top-4 right-4 z-10">
                        <CloseButton />
                    </div>

                    {/* Image Section */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-t-xl">
                        <Image
                            fill
                            src={product.photo}
                            alt={product.title}
                            className="object-cover"
                        />
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 border-b border-neutral-700 px-6 py-4">
                        <div className="size-12 overflow-hidden rounded-full bg-neutral-800">
                            {product.user.avatar ? (
                                <Image
                                    src={product.user.avatar}
                                    width={48}
                                    height={48}
                                    alt={product.user.username}
                                    className="object-cover"
                                />
                            ) : (
                                <UserIcon className="h-full w-full p-2 text-neutral-400" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{product.user.username}</h3>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4 px-6 py-6">
                        <h1 className="text-2xl font-bold">{product.title}</h1>
                        <p className="text-sm whitespace-pre-line text-neutral-300">
                            {product.description}
                        </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between rounded-b-xl border-t border-neutral-800 bg-neutral-800 px-6 py-4">
                        <span className="text-xl font-semibold text-white">
                            ₩{formatToWon(product.price)}
                        </span>
                        {isOwner ? (
                            <DeleteButton id={id} />
                        ) : (
                            <Link
                                href={``}
                                className="rounded-md bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                            >
                                Chat
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </ScrollLockWrapper>
    );
}
