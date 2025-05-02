"use server";

export async function handleForm(prevState: unknown, formData: FormData) {
    return {
        errors: ["wrong password", "password too short"],
    };
}
