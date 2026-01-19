import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // Protect /admin routes - require ADMIN role
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/account", req.url))
        }
        // Check if user has ADMIN role
        const userRole = req.auth?.user?.role
        if (userRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/account", req.url))
        }
    }


    // Protect /api/admin/* routes - require ADMIN role
    if (pathname.startsWith("/api/admin")) {
        if (!isLoggedIn) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }
        // Check if user has ADMIN role
        const userRole = req.auth?.user?.role
        if (userRole !== "ADMIN") {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            )
        }
    }

    return NextResponse.next()
})

// Do not run middleware on these paths
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
