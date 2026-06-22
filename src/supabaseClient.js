import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "CRITICAL WARNING: Supabase URL or Anon Key is missing! " +
    "Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "in your deployment environment variables (e.g. Vercel dashboard)."
  );
}

// Fallback to placeholder strings to prevent React from crashing on load if vars are missing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)
