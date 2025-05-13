import db from "@/lib/db";
import {
    getAccessTokenResponse,
    getUserEmailResponse,
    getUserProfileResponse,
} from "@/lib/github/getGitHubResponse";
import LogUserIn from "@/lib/login";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code"); // gets code generated from connecting to github
    if (!code) {
        return notFound();
    }

    const { error, access_token } = await getAccessTokenResponse(code);

    if (error) {
        return new Response(null, {
            status: 400,
        });
    }

    const { email } = await getUserEmailResponse(access_token);

    // check for emails
    const findEmail = await db.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
        },
    });

    if (findEmail) {
        return new NextResponse("Email is already in use.", {
            status: 400,
        });
    }

    const { id, avatar_url, githubUsername } = await getUserProfileResponse(access_token);

    // Uses github id to find existing user
    const user = await db.user.findUnique({
        where: {
            github_id: id + "",
        },
        select: {
            id: true,
        },
    });
    if (user) {
        // if the user is already exists in the database, log in.
        LogUserIn(user.id);
    }

    // if user is not in the database, check for username
    const username = await db.user.findUnique({
        where: {
            username: githubUsername,
        },
        select: {
            id: true,
        },
    });

    // if the user does not exist in the database, create new user and redirect to the profile page.
    const newUser = await db.user.create({
        data: {
            username: username ? `${githubUsername + Date.now()}` : githubUsername,
            github_id: id + "",
            avatar: avatar_url,
            email,
        },
        select: {
            id: true,
        },
    });

    // once the user has been created in the database, log user in.
    LogUserIn(newUser.id);
}
