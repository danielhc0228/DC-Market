import { formatToDollar, formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
    title: string;
    price: number;
    created_at: string;
    photo: string;
    id: number;
    isSold: boolean;
}

export default function ListProduct({
    title,
    price,
    created_at,
    photo,
    id,
    isSold,
}: ListProductProps) {
    return (
        <Link href={`/products/${id}`} className="flex gap-5">
            <div className="relative size-28 overflow-hidden rounded-md">
                <Image fill src={photo} className="object-contain" alt={title} />
            </div>
            <div className="flex flex-col gap-1 *:text-white">
                <span className="max-w-[200px] truncate overflow-hidden text-lg whitespace-nowrap">
                    {isSold ? (
                        <>
                            <span className="text-red-500">[Sold]</span> {title}
                        </>
                    ) : (
                        title
                    )}
                </span>

                <span className="text-sm text-neutral-500">{formatToTimeAgo(created_at)}</span>
                <span className="text-lg font-semibold">${formatToDollar(price)}</span>
            </div>
        </Link>
    );
}
