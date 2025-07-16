import db from "@/lib/db";
import getSession from "@/lib/session";
import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }
    notFound(); // displays 404 error if session is not found
}

async function getReceivedReview() {
    const session = await getSession();
    const [reviews, totalReviews, starSummary] = await Promise.all([
        db.review.findMany({
            where: {
                revieweeId: session.id,
            },
            select: {
                rating: true,
                comment: true,
                reviewer: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        }),
        db.review.count({
            where: {
                revieweeId: session.id,
            },
        }),
        db.review.groupBy({
            by: ["rating"],
            where: { revieweeId: session.id },
            _count: { rating: true },
        }),
    ]);

    return { reviews, totalReviews, starSummary };
}

async function getSoldItems() {
    const session = await getSession();
    const soldItems = await db.product.findMany({
        where: {
            userId: session.id,
            isSold: true,
        },
        orderBy: {
            updated_at: "desc",
        },
        take: 2,
        select: {
            id: true,
            title: true,
            photo: true,
        },
    });

    return soldItems;
}

async function getBoughtItems() {
    const session = await getSession();
    const boughtItems = await db.product.findMany({
        where: {
            buyerId: session.id,
            isSold: true,
        },
        orderBy: {
            updated_at: "desc",
        },
        take: 2,
        select: {
            id: true,
            title: true,
            photo: true,
        },
    });

    return boughtItems;
}

function calcAvg(reviews: { rating: number }[]) {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    // for (let i = 0; i < reviews.length; i++) {
    //     total += reviews[i].rating;
    // }

    return total / reviews.length;
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    };
    const receivedReview = await getReceivedReview();
    const averageReview = calcAvg(receivedReview.reviews);
    const soldItems = await getSoldItems();
    const boughtItems = await getBoughtItems();

    const fullSummary = [5, 4, 3, 2, 1].map((star) => {
        const found = receivedReview.starSummary.find((r) => r.rating === star);
        return {
            star,
            count: found ? found._count.rating : 0,
        };
    });

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-3xl font-bold text-orange-500">Welcome, {user?.username}!</h1>
                <div className="flex items-center gap-1 text-xl text-yellow-400">
                    <StarIcon width={24} height={24} />
                    <span>{averageReview === 0 ? "--" : averageReview.toFixed(2)}</span>
                </div>
                <Link href={`/profile/edit`}>
                    <button className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 font-semibold text-white shadow-md transition hover:brightness-110 focus:ring-4 focus:ring-pink-300 focus:outline-none">
                        Edit Profile
                    </button>
                </Link>
            </div>

            {/* Bought Items */}
            <div>
                <h2 className="mb-2 text-xl font-semibold text-white">Bought Items</h2>
                {boughtItems.length > 0 ? (
                    <div className="space-y-3">
                        {boughtItems.map((boughtItem) => (
                            <Link
                                href={`/products/${boughtItem.id}`}
                                key={boughtItem.id}
                                className="flex items-center gap-4 rounded-md bg-white p-3 shadow hover:bg-gray-50"
                            >
                                <div className="relative size-20 overflow-hidden rounded-md">
                                    <Image
                                        fill
                                        src={boughtItem.photo}
                                        className="object-cover"
                                        alt={boughtItem.title}
                                    />
                                </div>
                                <span className="text-base font-medium text-gray-800">
                                    {boughtItem.title}
                                </span>
                            </Link>
                        ))}
                        {/* Link to full bought items page */}
                        <div className="mt-2 text-right">
                            <Link
                                href="/profile/bought"
                                className="text-sm text-orange-500 hover:underline"
                            >
                                View all bought items →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-300">You haven&apos;t bought anything yet!</p>
                )}
            </div>

            {/* Sold Items */}
            <div>
                <h2 className="mb-2 text-xl font-semibold text-white">Sold Items</h2>
                {soldItems.length > 0 ? (
                    <div className="space-y-3">
                        {soldItems.map((soldItem) => (
                            <Link
                                href={`/products/${soldItem.id}`}
                                key={soldItem.id}
                                className="flex items-center gap-4 rounded-md bg-white p-3 shadow hover:bg-gray-50"
                            >
                                <div className="relative size-20 overflow-hidden rounded-md">
                                    <Image
                                        fill
                                        src={soldItem.photo}
                                        className="object-cover"
                                        alt={soldItem.title}
                                    />
                                </div>
                                <span className="text-base font-medium text-gray-800">
                                    {soldItem.title}
                                </span>
                            </Link>
                        ))}
                        {/* Link to full sold items page */}
                        <div className="mt-2 text-right">
                            <Link
                                href="/profile/sold"
                                className="text-sm text-orange-500 hover:underline"
                            >
                                View all sold items →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-300">You haven&apos;t sold anything yet!</p>
                )}
            </div>

            {/* Reviews Summary */}
            <div>
                <h2 className="mb-2 text-xl font-semibold text-white">Reviews</h2>
                <p className="mb-2 text-sm text-gray-300">
                    Total: {receivedReview.totalReviews} reviews
                </p>
                <div className="space-y-1">
                    {fullSummary.map((r) => (
                        <div key={r.star} className="flex items-center gap-2">
                            <div className="flex min-w-[80px]">
                                {Array.from({ length: r.star }).map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        width={14}
                                        height={14}
                                        className="text-yellow-400"
                                    />
                                ))}
                            </div>
                            <div className="relative h-3 w-full rounded bg-gray-200">
                                <div
                                    className="absolute top-0 left-0 h-3 rounded bg-orange-400"
                                    style={{
                                        width: `${(r.count / receivedReview.totalReviews) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span className="w-6 text-sm text-gray-100">{r.count}</span>
                        </div>
                    ))}
                </div>
                <Link href="/reviews">
                    <button className="mt-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 font-semibold text-white shadow-md transition hover:brightness-110 focus:ring-4 focus:ring-pink-300 focus:outline-none">
                        See Comments
                    </button>
                </Link>
            </div>

            {/* Logout */}
            <form action={logOut}>
                <button className="mb-25 w-full rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110 focus:ring-4 focus:ring-pink-300 focus:outline-none">
                    Log out
                </button>
            </form>
        </div>
    );
}
