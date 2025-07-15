"use client";

import { formatToTimeAgo } from "@/lib/utils";
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
    created_at: Date;
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
                    className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
                        filterRating === 5
                            ? "border-orange-500 bg-orange-100 text-orange-600"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    ★★★★★
                </button>
                <button
                    onClick={() => handleFilter(filterRating === 4 ? null : 4)}
                    className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
                        filterRating === 4
                            ? "border-orange-500 bg-orange-100 text-orange-600"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    ★★★★
                </button>
                <button
                    onClick={() => handleFilter(filterRating === 3 ? null : 3)}
                    className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
                        filterRating === 3
                            ? "border-orange-500 bg-orange-100 text-orange-600"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    ★★★
                </button>
                <button
                    onClick={() => handleFilter(filterRating === 2 ? null : 2)}
                    className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
                        filterRating === 2
                            ? "border-orange-500 bg-orange-100 text-orange-600"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    ★★
                </button>
                <button
                    onClick={() => handleFilter(filterRating === 1 ? null : 1)}
                    className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
                        filterRating === 1
                            ? "border-orange-500 bg-orange-100 text-orange-600"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    ★
                </button>
            </div>

            {/* Review list */}
            <div className="space-y-6">
                {filteredReviews.map((review) => (
                    <div
                        key={review.id}
                        className="rounded-xl border border-gray-100 bg-white p-5 shadow transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-start gap-4">
                            <Image
                                width={48}
                                height={48}
                                src={review.reviewer.avatar || "/avatar.png"}
                                alt={review.reviewer.username}
                                className="rounded-full border border-gray-200"
                            />
                            <div className="flex flex-1 flex-col">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-gray-800">
                                        {review.reviewer.username}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        {formatToTimeAgo(`${review.created_at}`)}
                                    </span>
                                </div>

                                <div className="mt-1 flex items-center gap-0.5">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                        <StarIcon key={i} className="size-4 text-yellow-400" />
                                    ))}
                                    {Array.from({ length: 5 - review.rating }).map((_, i) => (
                                        <StarIcon key={i} className="size-4 text-gray-300" />
                                    ))}
                                </div>

                                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                                    {review.comment ? (
                                        review.comment
                                    ) : (
                                        <span className="text-gray-400 italic">
                                            No comment provided.
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
