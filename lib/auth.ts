import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { bootstrapAdminOnce } from "./bootstrap-admin"

if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXTAUTH_SECRET) {
        throw new Error("NEXTAUTH_SECRET is required in production")
    }
    if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
        throw new Error("NEXTAUTH_URL must be set to production domain")
    }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await bootstrapAdminOnce().catch(() => { })

                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user || !user.passwordHash) {
                    return null
                }

                const isValid = await compare(
                    credentials.password as string,
                    user.passwordHash
                )

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Handle post-login redirect based on role
            // This callback runs after successful signIn
            if (url.startsWith(baseUrl)) {
                return url
            }
            return baseUrl
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                if (user.id) {
                    token.id = user.id
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as "USER" | "ADMIN"
                session.user.id = token.id as string
            }
            return session
        },
    },
    pages: {
        signIn: "/account",
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
    basePath: "/api/auth",
    trustHost: true,
    useSecureCookies: process.env.NODE_ENV === "production",
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
})

// Type-safe auth helpers
export type AuthSession = {
    user: {
        id: string
        email: string
        name: string
        role: "USER" | "ADMIN"
    }
}
