import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.')
  }
  _client = createClient(url, key)
  return _client
}

// Convenience alias — only call at runtime, not at module evaluation time
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export type MenuCategory = {
  id: number
  name: string
  slug: string
  created_at: string
}

export type MenuItem = {
  id: number
  category_id: number
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  created_at: string
  updated_at: string
}
