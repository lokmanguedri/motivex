import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import { bootstrapAdminOnce } from "./bootstrap-admin"

// Runtime environment validation
if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXTAUTH_SECRET) {
        console.error("❌ CRITICAL: NEXTAUTH_SECRET is missing in production!")
    }
    if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
        console.error("❌ CRITICAL: NEXTAUTH_URL must be set to production domain!")
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
                // Bootstrap admin at runtime (first auth attempt)
                await bootstrapAdminOnce().catch(err => {
                    console.error("Bootstrap failed during authorize:", err)
                })

                if (!credentials?.email || !credentials?.password) {
                    if (process.env.NODE_ENV === "development") {
                        console.log("[Auth] Missing credentials")
                    }
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
                    if (process.env.NODE_ENV === "development") {
                        console.log("[Auth] Invalid password for:", credentials.email)
                    }
                    return null
                }

                // Return user object that will be stored in JWT
                const authUser = {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                }

                if (process.env.NODE_ENV === "development") {
                    console.log("[Auth] User authorized:", authUser.email, "Role:", authUser.role)
                }

                return authUser
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
            // On sign in, add role to token
            if (user) {
                token.role = user.role
                token.id = user.id

                if (process.env.NODE_ENV === "development") {
                    console.log("[Auth] JWT created for:", user.email, "Role:", user.role)
                }
            }
            return token
        },
        async session({ session, token }) {
            // Add role and id to session
            if (session.user) {
                session.user.role = token.role as "USER" | "ADMIN"
                session.user.id = token.id as string

                if (process.env.NODE_ENV === "development") {
                    console.log("[Auth] Session created for:", session.user.email, "Role:", session.user.role)
                }
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
