import Link from "next/link";
import { getBoughtItems } from "../page";
import Image from "next/image";

export default async function BoughtItemsPage() {
    const boughtItems = await getBoughtItems(); // No limit

    return (
        <div className="space-y-4 p-4">
            <h1 className="text-2xl font-semibold">All Bought Items</h1>
            {boughtItems.length > 0 ? (
                <div className="space-y-3">
                    {boughtItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/products/${item.id}`}
                            className="flex items-center gap-4 rounded-md bg-white p-3 shadow hover:bg-gray-50"
                        >
                            <div className="relative size-20 overflow-hidden rounded-md">
                                <Image
                                    fill
                                    src={item.photo}
                                    className="object-cover"
                                    alt={item.title}
                                />
                            </div>
                            <span className="text-base font-medium text-gray-800">
                                {item.title}
                            </span>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No items purchased yet.</p>
            )}
        </div>
    );
}
