"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";
import ProductList from "./product-list";
import Link from "next/link";
import { useState } from "react";

interface ProductWrapperProps {
    initialProducts: InitialProducts;
    revalidate: () => void;
}

export default function ProductWrapper({ initialProducts, revalidate }: ProductWrapperProps) {
    const [filteredProducts, setFilteredProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState<
        "highest" | "lowest" | "newest" | "oldest" | undefined
    >(undefined);
    const [showSoldOnly, setShowSoldOnly] = useState(false);

    const applySortAndFilter = (
        products: InitialProducts,
        sort: "highest" | "lowest" | "newest" | "oldest" | undefined,
        soldOnly: boolean,
    ) => {
        const filtered = soldOnly ? products.filter((p) => p.isSold) : products;

        filtered.sort((a, b) => {
            switch (sort) {
                case "highest":
                    return b.price - a.price;
                case "lowest":
                    return a.price - b.price;
                case "newest":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const handleSort = (option: "highest" | "lowest" | "newest" | "oldest") => {
        setSortOption(option);
        const sorted = applySortAndFilter(initialProducts, option, showSoldOnly);
        setFilteredProducts(sorted);
    };

    const toggleSoldFilter = () => {
        const nextSoldOnly = !showSoldOnly;
        setShowSoldOnly(nextSoldOnly);
        const sorted = applySortAndFilter(initialProducts, sortOption, nextSoldOnly);
        setFilteredProducts(sorted);
    };

    return (
        <div>
            <div className="mt-5 flex gap-2">
                <form action={revalidate}>
                    <button className="cursor-pointer bg-transparent px-5 py-2.5 font-semibold text-white">
                        <ArrowPathIcon className="size-6" />
                    </button>
                </form>
                <div className="flex gap-2">
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) =>
                            handleSort(e.target.value as "highest" | "lowest" | "newest" | "oldest")
                        }
                        className="rounded-md border border-orange-300 bg-white px-3 py-1.5 text-sm text-orange-500 shadow-sm transition hover:bg-orange-50 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:outline-none"
                    >
                        <option value="highest">Rating: Highest to Lowest</option>
                        <option value="lowest">Rating: Lowest to Highest</option>
                        <option value="newest">Date: Newest First</option>
                        <option value="oldest">Date: Oldest First</option>
                    </select>
                    <button
                        onClick={toggleSoldFilter}
                        className={`flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${
                            showSoldOnly
                                ? "border-orange-300 bg-orange-100 text-orange-600"
                                : "bg-white text-gray-600"
                        }`}
                    >
                        Sold
                    </button>
                </div>
            </div>

            <ProductList initialProducts={filteredProducts} />
            <Link
                href="/home/add"
                className="fixed right-8 bottom-24 flex size-16 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-10" />
            </Link>
        </div>
    );
}
