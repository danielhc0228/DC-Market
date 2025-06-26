import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }
    notFound(); // displays 404 error if session is not found
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    };
    return (
        <div>
            <h1>Welcome! {user?.username}!</h1>
            <button>Edit Profile</button>
            <div>Bought Items:</div>
            <div>Sold Items:</div>
            <div>Reviews:</div>
            <form action={logOut}>
                <button className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:brightness-110 focus:ring-4 focus:ring-pink-300 focus:outline-none">
                    Log out
                </button>
            </form>
        </div>
    );
}
