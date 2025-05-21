"use server";

// Create object of photo, title, price and its description
export async function uploadProduct(formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };
    console.log(data);
}
