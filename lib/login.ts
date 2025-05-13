import { redirect } from "next/navigation";
import getSession from "./session";

export default async function LogUserIn(userId: number) {
    const session = await getSession();
    session.id = userId;
    await session.save();
    return redirect("/profile");
}
