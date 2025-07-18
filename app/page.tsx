import Link from "next/link";
import "@/lib/db";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-between py-5">
            <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
                <Image
                    src={"/logo.png"}
                    width={108}
                    height={108}
                    alt={"Logo"}
                    className="object-cover"
                />
                <h2 className="text-2xl">Welcome to DC Market!</h2>
            </div>
            <div className="flex w-full flex-col items-center gap-3">
                <Link href="/create-account" className="primary-btn py-2.5 text-lg">
                    Begin
                </Link>
                <div className="flex gap-2">
                    <span>Already have an account?</span>
                    <Link href="/login" className="hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
