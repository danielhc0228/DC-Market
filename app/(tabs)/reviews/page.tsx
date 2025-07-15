import db from "@/lib/db";
import getSession from "@/lib/session";
import ReviewList from "@/components/review-list";

async function getReceivedReview() {
    const session = await getSession();
    const reviews = await db.review.findMany({
        where: {
            revieweeId: session.id,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            reviewer: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
            created_at: true,
        },
    });

    return reviews;
}

export default async function Reviews() {
    const reviews = await getReceivedReview();

    return <ReviewList reviews={reviews} />;
}
