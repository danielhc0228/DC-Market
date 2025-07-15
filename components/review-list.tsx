"use client";

import { ChevronDownIcon, ChevronUpIcon, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

interface IReviews {
    id: number;
    reviewer: {
        avatar: string | null;
        username: string;
    };
    rating: number;
    comment: string;
}

export default function ReviewList({ reviews }: { reviews: IReviews[] }) {
    const [filteredReviews, setFilteredReviews] = useState(reviews);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [sortOption, setSortOption] = useState<"highest" | "lowest" | null>(null);

    const handleSort = (option: "highest" | "lowest") => {
        setSortOption(option);
        const sorted = [...filteredReviews];
        sorted.sort((a, b) => (option === "highest" ? b.rating - a.rating : a.rating - b.rating));
        setFilteredReviews(sorted);
    };

    const handleFilter = (rating: number | null) => {
        setFilterRating(rating);
        if (rating) {
            setFilteredReviews(reviews.filter((r) => r.rating === rating));
        } else {
            setFilteredReviews(reviews);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <h1 className="text-2xl font-bold text-orange-500">Received Reviews</h1>
            {/* Controls */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleSort(sortOption === "highest" ? "lowest" : "highest")}
                    className="flex items-center gap-1 rounded-md border border-orange-300 bg-white px-3 py-1.5 text-sm text-orange-500 hover:bg-orange-50"
                >
                    {sortOption === "highest" ? (
                        <>
                            Sort by Highest <ChevronDownIcon className="size-4" />
                        </>
                    ) : (
                        <>
                            Sort by Lowest <ChevronUpIcon className="size-4" />
                        </>
                    )}
                </button>
                <button
                    onClick={() => handleFilter(filterRating === 5 ? null : 5)}
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                    ★★★★★
                </button>
            </div>

            {/* Review list */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <div
                        key={review.id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
                    >
                        <div className="mb-2 flex items-center gap-3">
                            <Image
                                width={48}
                                height={48}
                                src={
                                    review.reviewer.avatar ? review.reviewer.avatar : "/avatar.png"
                                }
                                alt={review.reviewer.username}
                                className="rounded-full"
                            />
                            <div>
                                <div className="font-semibold text-gray-800">
                                    {review.reviewer.username}
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <StarIcon key={i} className="size-4 text-yellow-400" />
                                    ))}
                                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                                        <StarIcon key={i} className="size-4 text-gray-300" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-700">
                            {review.comment || <i>No comment provided.</i>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
