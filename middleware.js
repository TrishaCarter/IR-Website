import { NextResponse } from "next/server";
import * as jose from "jose"

export async function middleware(req) {
    let token = req.cookies.get("auth_token").value.toString();
    let secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

    // console.log("Token:", token);
    // console.log("Secret:", secret);

    // if (!token) {
    //     return NextResponse.redirect(new URL("/login", req.url));
    // }

    try {
        // Verify the token
        const { payload, protectedHeader } = await jose.jwtVerify(token, secret);
        return NextResponse.next();
    } catch (error) {
        // return NextResponse.redirect(new URL("/login", req.url));
        console.log("JWT verification failed:", error);

    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/protected-page"], // Protect specific routes
};