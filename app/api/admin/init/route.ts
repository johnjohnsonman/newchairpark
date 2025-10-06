import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json()

    // Only allow specific emails to become admin
    const allowedAdminEmails = ["hello@chairpark.com", "admin@chairpark.com"]

    if (!allowedAdminEmails.includes(email)) {
      return NextResponse.json({ error: "Not authorized to become admin" }, { status: 403 })
    }

    // Use service role key to bypass RLS
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if role already exists
    const { data: existingRole } = await supabaseAdmin.from("user_roles").select("*").eq("user_id", userId).single()

    if (existingRole) {
      return NextResponse.json({ success: true, role: existingRole.role })
    }

    // Insert admin role
    const { data, error } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "admin",
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, role: data.role })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to initialize admin" }, { status: 500 })
  }
}
