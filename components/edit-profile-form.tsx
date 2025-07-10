"use client";

import { useState } from "react";
import Image from "next/image";

interface EditProfileFormProps {
    user: {
        username: string;
        email: string | null;
        avatar: string | null;
    };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email ?? "");
    const [avatar, setAvatar] = useState<File | null>(null);

    return (
        <div className="mx-auto max-w-xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold text-white">Edit Profile</h1>
            <form
                className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
                onSubmit={(e) => {
                    e.preventDefault();
                    // handle submit logic
                }}
            >
                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                    <Image
                        src={avatar ? URL.createObjectURL(avatar) : user.avatar || "/avatar.png"}
                        alt="Avatar"
                        width={64}
                        height={64}
                        className="rounded-full border"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full rounded-md border p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
