"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export default function ReviewForm({
    productId,
    reviewerId,
    submitReview,
}: {
    productId: number;
    reviewerId: number;
    submitReview: (formData: FormData) => void;
}) {
    const [rating, setRating] = useState(0);

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
    };

    return (
        <form
            action={(formData) => {
                formData.set("rating", rating.toString());
                submitReview(formData);
            }}
            className="space-y-3"
        >
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="reviewerId" value={reviewerId} />
            <input type="hidden" name="rating" value={rating} />

            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        width={24}
                        height={24}
                        className={`cursor-pointer ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => handleStarClick(star)}
                    />
                ))}
            </div>

            <label className="block">
                <textarea
                    name="comment"
                    required
                    className="w-full rounded border p-2"
                    placeholder="Write your review..."
                ></textarea>
            </label>

            <button className="rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-400">
                Submit Review
            </button>
        </form>
    );
}
