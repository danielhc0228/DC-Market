// app/profile/edit/page.tsx
import getSession from "@/lib/session";
import db from "@/lib/db";
import EditProfileForm from "@/components/edit-profile-form"; // Client component

export default async function EditProfilePage() {
    const session = await getSession();
    const user = await db.user.findUnique({
        where: { id: session.id },
        select: {
            username: true,
            email: true,
            phone: true,
            avatar: true,
        },
    });

    return <EditProfileForm user={user!} />;
}
