import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
};

// const publicUrls = new Set(['/', '/login', '/sms', '/create-account']); // Set is a good option too

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url)); // if user is logged out and tries to access private url, redirect to home page
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/products", request.url)); // else, send user to product page (for now).
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
    //middleware only runs where matcher specifiy. In this case, only run when there is no /api, /_next/static etc.
    // ["/", "/profile", "/create-account"] <- only runs in those address
};
