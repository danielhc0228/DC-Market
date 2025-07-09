"use client";

export default function ReviewForm({
    productId,
    reviewerId,
    submitReview,
}: {
    productId: number;
    reviewerId: number;
    submitReview: (formData: FormData) => void;
}) {
    return (
        <form action={submitReview}>
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="reviewerId" value={reviewerId} />
            <label className="mb-1 block">
                Rating:
                <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    required
                    className="ml-2 w-16 border p-1"
                />
            </label>

            <label className="mb-2 block">
                Comment:
                <textarea
                    name="comment"
                    required
                    className="w-full border p-2"
                    placeholder="Write your review..."
                ></textarea>
            </label>

            <button className="rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-400">
                Submit Review
            </button>
        </form>
    );
}
