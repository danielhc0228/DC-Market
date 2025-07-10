"use client";

import { useState } from "react";

export default function EditProfile() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);

    return (
        <div className="mx-auto max-w-xl px-6 py-10">
            <h1 className="mb-6 text-3xl font-bold text-white">Edit Profile</h1>
            <form
                className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
                onSubmit={(e) => {
                    e.preventDefault();
                    // handle form submission logic here
                }}
            >
                {/* Username */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        placeholder="Enter your username"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Phone</label>
                    <input
                        type="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        placeholder="Enter your phone"
                    />
                </div>

                {/* Avatar Upload */}
                <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                        className="w-full text-sm"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-400"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
