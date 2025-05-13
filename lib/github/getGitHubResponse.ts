export async function getAccessTokenResponse(code: string) {
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();

    console.log(accessTokenParams);

    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });

    return accessTokenResponse.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserProfileResponse(access_token: Promise<any>) {
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return userProfileResponse.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserEmailResponse(access_token: Promise<any>) {
    const userEmailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    return userEmailResponse.json();
}
