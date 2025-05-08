import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    console.log("hello");
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], //middleware only runs where matcher specifiy. In this case, only run when there is no /api, /_next/static etc.
};
