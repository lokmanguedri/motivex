import { NextRequest, NextResponse } from "next/server"

// Check for Supabase keys
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
    try {
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
                console.error("Supabase Upload Error:", await response.text())
                // Fallthrough to mock if upload fails (usually due to missing bucket)
            }
        }

        // 2. Mock response if no keys or upload failed (for dev/demo purposes)
        // In a real production scenario without keys, this should error out.
        // But to keep the UI working for the user to see the interaction:
        console.warn("Using mock upload response due to missing keys or upload failure")

        // Return a reliable placeholder or the blob URL if we could persist it (we can't easily persisting blob to disk in stateless lambda)
        // So we return an error asking for keys if this is "Production Hardening"
        return NextResponse.json(
            { error: "Upload configuration missing. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env" },
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
