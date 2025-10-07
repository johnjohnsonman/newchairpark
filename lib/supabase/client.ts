import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDYyOTEsImV4cCI6MjA3NTIyMjI5MX0.5YIOWXRDYoRl2BaJ8pZdzvjncnfnCkLB_ZQnZgbAdMk'
  
  return createSupabaseClient(supabaseUrl, supabaseKey)
}

export const createClient = createBrowserClient
