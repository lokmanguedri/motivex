import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        // Read keys inside the request handler to ensure they are fresh
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
        const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        // 1. If we have real keys, try to upload to Supabase
        if (SUPABASE_URL && SUPABASE_KEY) {
            const buffer = await file.arrayBuffer()
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

            // Upload to 'products' bucket
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${filename}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": file.type,
                },
                body: buffer,
            })

            if (response.ok) {
                const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${filename}`
                return NextResponse.json({ url: publicUrl })
            } else {
                const errorText = await response.text()
                console.error("Supabase Upload Error:", errorText)
                return NextResponse.json(
                    { error: `Supabase Error: ${errorText}` },
                    { status: response.status }
                )
            }
        }

        // 2. Mock response if no keys
        const missing = []
        if (!SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL")
        if (!SUPABASE_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")

        console.error("Missing vars detected:", missing)

        return NextResponse.json(
            { error: `Upload configuration missing. Missing variables: ${missing.join(", ")}. Please check .env` },
            { status: 500 }
        )

    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
