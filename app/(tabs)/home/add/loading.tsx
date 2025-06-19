export default function Loading() {
    return (
        <div className="p-5">
            <div className="flex animate-pulse flex-col gap-5">
                {/* Image Upload Placeholder */}
                <div className="aspect-square w-full rounded-md border-2 border-dashed border-neutral-300 bg-neutral-800" />

                {/* Title Input */}
                <div className="h-12 w-full rounded-md bg-neutral-700" />

                {/* Price Input */}
                <div className="h-12 w-full rounded-md bg-neutral-700" />

                {/* Description Input */}
                <div className="h-12 w-full rounded-md bg-neutral-700" />

                {/* Submit Button */}
                <div className="h-12 w-full rounded-md bg-neutral-600" />
            </div>
        </div>
    );
}
