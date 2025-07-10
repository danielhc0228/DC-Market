import { notFound } from "next/navigation";

interface ProfileProps {
    params: Promise<{ id: string }>;
}

export default async function EditProfilePage(props: ProfileProps) {
    const params = await props.params;
    const id = Number(params.id);
    // if id is not number or not found in the db, lead to 404 page.
    if (isNaN(id)) {
        return notFound();
    }
    return <div>edit page</div>;
}
