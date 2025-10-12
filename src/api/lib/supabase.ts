import { createClient } from "@supabase/supabase-js"

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(PUBLIC_URL, ANON_KEY)

export default supabase;