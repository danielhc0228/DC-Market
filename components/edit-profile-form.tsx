"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { editProfile } from "@/app/(tabs)/profile/edit/actions";
import Input from "./input";

interface EditProfileFormProps {
    user: {
        id: number;
        username: string;
        email: string | null;
        phone: string | null;
        avatar: string | null;
    };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
    const [state, action] = useActionState(editProfile, null);
    const [preview, setPreview] = useState(user.avatar || "/avatar.png");

    return (
        <div className="mx-auto max-w-xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold text-white">Edit Profile</h1>
            <form action={action} className="space-y-6 rounded-lg bg-white p-6 shadow-lg">
                <input type="hidden" name="id" value={user.id} />

                {/* Avatar Preview */}
                <div className="text-md flex items-center gap-2 font-medium text-black">
                    {preview && (
                        <Image
                            src={preview}
                            alt="Avatar Preview"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                        />
                    )}
                    <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        className="block w-full text-black"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const reader = new FileReader();
                                reader.onload = () => setPreview(reader.result as string);
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}
                    />
                    <input
                        type="hidden"
                        name="originalAvatar"
                        value={user.avatar || "/avatar.png"}
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Username</label>
                    <Input
                        name="username"
                        required
                        placeholder="Username"
                        type="text"
                        errors={state?.fieldErrors.username}
                        defaultValue={user.username}
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <Input
                        name="email"
                        required
                        placeholder="Email"
                        type="text"
                        errors={state?.fieldErrors.email}
                        defaultValue={user.email!}
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-400"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
