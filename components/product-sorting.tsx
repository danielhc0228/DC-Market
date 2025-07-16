import { InitialProducts } from "@/app/(tabs)/home/page";
import { useState } from "react";

interface ProductListProps {
    initialProducts: InitialProducts;
}

export default function ProductSorting({ initialProducts }: ProductListProps) {
    const [filteredProducts, setFilteredProducts] = useState(initialProducts);
    const [sortOption, setSortOption] = useState<
        "highest" | "lowest" | "newest" | "oldest" | undefined
    >(undefined);

    const handleSort = (option: "highest" | "lowest" | "newest" | "oldest") => {
        setSortOption(option);

        const sorted = [...filteredProducts];

        sorted.sort((a, b) => {
            switch (option) {
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

        setFilteredProducts(sorted);
    };
    return (
        <div>
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
                className={`flex cursor-pointer items-center gap-1 rounded-md border px-3 py-1.5 text-sm`}
            >
                Sold
            </button>
        </div>
    );
}
