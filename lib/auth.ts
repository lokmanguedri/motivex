import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"
import type { User } from "@prisma/client"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
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

                // Return user object that will be stored in JWT
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
        async jwt({ token, user }) {
            // On sign in, add role to token
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            // Add role and id to session
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
