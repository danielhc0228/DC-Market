"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ModalWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // Close modal by navigating back
    const onClose = useCallback(() => {
        router.back();
    }, [router]);

    // Prevent scroll on mount
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    // Prevent clicks inside modal from bubbling up
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
            onClick={onClose}
        >
            <div
                onClick={stopPropagation}
                className="w-full max-w-2xl rounded-xl bg-neutral-900 p-6 shadow-lg"
            >
                {children}
            </div>
        </div>
    );
}
