"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import type { Order } from "@/lib/types"

// Keep the same interface so existing UI doesn't need changes
interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  wilaya?: string
  role: "customer" | "admin"
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  logout: () => void
  orders: Order[]
  addOrder: (order: Order) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  // Map NextAuth session to our User type
  const user: User | null = session?.user
    ? {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || "",
      phone: "",
      role: session.user.role === "ADMIN" ? "admin" : "customer",
      createdAt: new Date(),
    }
    : null

  const isLoading = status === "loading"

  // Temporary orders state (will be replaced with API in Phase 3.2)
  const orders: Order[] = []

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await nextAuthSignIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        // Wait for session to be established
        await new Promise(resolve => setTimeout(resolve, 500))

        // Fetch session to get role
        const sessionRes = await fetch("/api/auth/session")
        const sessionData = await sessionRes.json()


        console.log("Session after login:", sessionData)

        if (!sessionData?.user) {
          console.error("Session not established, redirecting to account")
          window.location.href = "/account"
          return true
        }

        // Redirect based on role
        if (sessionData.user.role === "ADMIN") {
          console.log("Redirecting admin to /admin")
          window.location.href = "/admin"
        } else {
          console.log("Redirecting user to /account")
          window.location.href = "/account"
        }

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const nameParts = name.trim().split(" ")
      const firstName = nameParts[0] || name
      const lastName = nameParts.slice(1).join(" ") || firstName

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, phone }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Auto-login after successful registration
      return await login(email, password)
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  const logout = () => {
    nextAuthSignOut({ redirect: false })
  }

  const addOrder = (order: Order) => {
    // Will be implemented with API in Phase 3.2
    console.log("Add order not yet implemented:", order)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        orders,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
