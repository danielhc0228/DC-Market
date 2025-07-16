import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/solid";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";
import CommentInput from "@/components/comment-input";
import Link from "next/link";

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
                        comments: true,
                        likes: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                        payload: true, //comment string
                        userId: true, //userid of author
                        created_at: true,
                        user: {
                            select: {
                                avatar: true, //avatar of author
                                username: true, //username of author
                            },
                        },
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

    const { likeCount, isLiked } = await getCachedLikeStatus(id);
    const session = await getSession();
    return (
        <div className="p-5 text-white">
            <div className="mb-2 flex items-center gap-2">
                <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={post.user.avatar ? post.user.avatar : "/avatar.png"}
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
                <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
            </div>
            <CommentInput
                id={id}
                sessionId={session.id!}
                comments={post.comments}
                user={post.user}
            />
            <Link
                href="/life"
                className="fixed top-5 right-5 flex size-10 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
            >
                <ArrowLeftIcon className="size-7" />
            </Link>
        </div>
    );
}
