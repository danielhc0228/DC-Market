export default function Loading() {
    return (
        <div className="flex animate-pulse flex-col p-5">
            {[...Array(10)].map((_, index) => (
                <div
                    key={index}
                    className="mb-5 flex flex-col gap-2 border-b border-neutral-500 pb-5 last:border-b-0 last:pb-0"
                >
                    {/* Title */}
                    <div className="h-6 w-2/3 rounded-md bg-neutral-700" />
                    {/* Description */}
                    <div className="h-4 w-full rounded-md bg-neutral-700" />
                    <div className="h-4 w-5/6 rounded-md bg-neutral-700" />
                    {/* Meta Info (time + views) and icons */}
                    <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-4 w-16 rounded-md bg-neutral-700" />
                            <div className="h-4 w-2 rounded-md bg-neutral-700" />
                            <div className="h-4 w-20 rounded-md bg-neutral-700" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <div className="h-4 w-4 rounded-md bg-neutral-700" />
                                <div className="h-4 w-6 rounded-md bg-neutral-700" />
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-4 w-4 rounded-md bg-neutral-700" />
                                <div className="h-4 w-6 rounded-md bg-neutral-700" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
