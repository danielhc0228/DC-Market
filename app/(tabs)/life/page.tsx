import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import { ChatBubbleBottomCenterIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getPosts() {
    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            views: true,
            created_at: true,
            _count: {
                // find the number of total comments and likes for each posts
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });
    return posts.map((post) => ({
        ...post,
        created_at: post.created_at.toISOString(), // Make it serializable
    }));
}

export const metadata = {
    title: "Life",
};

export default async function Life() {
    const posts = await getPosts();
    return (
        <div className="flex flex-col p-5">
            <h1 className="mb-6 text-2xl text-amber-50">Posts</h1>
            <Link
                href="/life/add"
                className="fixed top-5 right-5 flex size-10 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <PlusIcon className="size-7" />
            </Link>
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="mb-5 flex flex-col gap-2 border-b border-neutral-500 pb-5 text-neutral-400 last:border-b-0 last:pb-0"
                >
                    <h2 className="text-lg font-semibold text-white">{post.title}</h2>
                    <p>{post.description}</p>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <span>{formatToTimeAgo(post.created_at)}</span>
                            <span>·</span>
                            <span>Views {post.views}</span>
                        </div>
                        <div className="flex items-center gap-4 *:flex *:items-center *:gap-1">
                            <span>
                                <HandThumbUpIcon className="size-4" />
                                {post._count.likes}
                            </span>
                            <span>
                                <ChatBubbleBottomCenterIcon className="size-4" />
                                {post._count.comments}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
