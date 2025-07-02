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
    const receivedReview = await db.review.findMany({
        where: {
            revieweeId: session.id,
        },
        select: {
            rating: true,
        },
    });

    return receivedReview;
}

async function getSoldItems() {
    const session = await getSession();
    const soldItems = await db.product.findMany({
        where: {
            userId: session.id,
            isSold: true,
        },
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
    const averageReview = calcAvg(receivedReview);
    const soldItems = await getSoldItems();
    const boughtItems = await getBoughtItems();

    return (
        <div>
            <h1>Welcome! {user?.username}!</h1>
            <h2>
                <StarIcon width={20} height={20} />
                {averageReview === 0 ? "--" : averageReview.toFixed(2)}
            </h2>
            <button>Edit Profile</button>
            <div>
                Bought Items:
                {boughtItems.length > 0 ? (
                    <div>
                        {boughtItems.map((boughtItem) => (
                            <Link
                                href={`/products/${boughtItem.id}`}
                                key={boughtItem.id}
                                className="flex gap-5"
                            >
                                <div className="relative size-28 overflow-hidden rounded-md">
                                    <Image
                                        fill
                                        src={boughtItem.photo}
                                        className="object-cover"
                                        alt={boughtItem.title}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 *:text-white">
                                    <span className="text-lg">{boughtItem.title}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    "You haven't bought anything yet!"
                )}
            </div>
            <div>
                Sold Items:
                {soldItems.length > 0 ? (
                    <div>
                        {soldItems.map((soldItem) => (
                            <Link
                                href={`/products/${soldItem.id}`}
                                key={soldItem.id}
                                className="flex gap-5"
                            >
                                <div className="relative size-28 overflow-hidden rounded-md">
                                    <Image
                                        fill
                                        src={soldItem.photo}
                                        className="object-cover"
                                        alt={soldItem.title}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 *:text-white">
                                    <span className="text-lg">{soldItem.title}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    "You haven't sold anything yet!"
                )}
            </div>
            <div>Reviews:</div>

            <form action={logOut}>
                <button className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110 focus:ring-4 focus:ring-pink-300 focus:outline-none">
                    Log out
                </button>
            </form>
        </div>
    );
}
