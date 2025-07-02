import db from "@/lib/db";
import getSession from "@/lib/session";
import { StarIcon } from "@heroicons/react/24/solid";
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

    return (
        <div>
            <h1>Welcome! {user?.username}!</h1>
            <h2>
                <StarIcon width={20} height={20} />
                {averageReview === 0 ? "--" : averageReview.toFixed(2)}
            </h2>
            <button>Edit Profile</button>
            <div>Bought Items:</div>
            <div>Sold Items:</div>
            <div>Reviews:</div>

            <form action={logOut}>
                <button className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110 focus:ring-4 focus:ring-pink-300 focus:outline-none">
                    Log out
                </button>
            </form>
        </div>
    );
}
