"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Modal({ params }: { params: { id: string } }) {
    const router = useRouter();
    const onCloseClick = () => {
        router.back();
    };
    return (
        <div className="bg-opacity-80 absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/75">
            <button onClick={onCloseClick} className="absolute top-5 right-5 text-neutral-200">
                <XMarkIcon className="size-10" />
            </button>
            <div className="flex h-1/2 w-full max-w-screen-sm justify-center">
                <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-700 text-neutral-200">
                    <PhotoIcon className="h-28" />
                </div>
            </div>
        </div>
    );
}
