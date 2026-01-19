export const runtime = "nodejs"

import { resetAdminPassword } from "@/lib/reset-admin-password"
import { handlers } from "@/lib/auth"

// Reset admin password on server start (one-time)
resetAdminPassword().catch(console.error)

export const { GET, POST } = handlers
