import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { revalidateTag, unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getPost(id: number) {
    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                },
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        Comment: true,
                        Like: true,
                    },
                },
            },
        });
        return post;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return null;
    }
}

// this caches post data which makes the view count to not increment every time a like button is clicked.
const getCachedPost = unstable_cache(getPost, ["post-detail"], {
    tags: ["post-detail"],
    revalidate: 60,
});

// return the number of likes of a post and let isLiked to true if a user has already liked the post
async function getLikeStatus(postId: number, userId: number) {
    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId: userId,
            },
        },
    });
    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });
    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

// store likedstatus as cache.
// the function is outside of PostDetail but postId can be retrieved by doing recursive act.
async function getCachedLikeStatus(postId: number) {
    const session = await getSession();
    const userId = session.id;
    const cachedOperation = unstable_cache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`],
    });
    return cachedOperation(postId, userId!);
}

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const param = await params;
    const id = Number(param.id);

    if (isNaN(id)) {
        return notFound();
    }
    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }
    const likePost = async () => {
        "use server";
        const session = await getSession();
        try {
            await db.like.create({
                data: {
                    postId: id,
                    userId: session.id!,
                },
            });
            revalidateTag(`like-status-${id}`); // revalidates like status
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
    };
    const dislikePost = async () => {
        "use server";
        try {
            const session = await getSession();
            await db.like.delete({
                where: {
                    id: {
                        postId: id,
                        userId: session.id!,
                    },
                },
            });
            revalidateTag(`like-status-${id}`);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
    };
    const { likeCount, isLiked } = await getCachedLikeStatus(id);
    return (
        <div className="p-5 text-white">
            <div className="mb-2 flex items-center gap-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar!}
                    alt={post.user.username}
                />
                <div>
                    <span className="text-sm font-semibold">{post.user.username}</span>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="mb-5">{post.description}</p>
            <div className="flex flex-col items-start gap-5">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <EyeIcon className="size-5" />
                    <span>Views {post.views}</span>
                </div>
                <form action={isLiked ? dislikePost : likePost}>
                    <button
                        className={`flex items-center gap-2 rounded-full border border-neutral-400 p-2 text-sm text-neutral-400 transition-colors ${
                            isLiked
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "hover:bg-neutral-800"
                        }`}
                    >
                        {isLiked ? (
                            <HandThumbUpIcon className="size-5" />
                        ) : (
                            <OutlineHandThumbUpIcon className="size-5" />
                        )}
                        {isLiked ? <span> {likeCount}</span> : <span>Like ({likeCount})</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}
