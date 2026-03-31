import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && key ? createClient(url, key) : null
export const hasSupabase = !!supabase

if (supabase) console.log('[Supabase] Client initialized:', url);
else console.log('[Supabase] No credentials — running in offline mode');
