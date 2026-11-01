import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Gunakan service role key untuk bypass RLS, atau fallback ke anon key
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  // Service role key bisa bypass RLS — taruh di env sebagai SUPABASE_SERVICE_ROLE_KEY
  // Kalau tidak ada, gunakan anon key (pastikan RLS di admin_users di-disable)
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json(
      { success: false, message: 'Username dan password wajib diisi.' },
      { status: 400 }
    )
  }

  const supabase = getAdminClient()

  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, password')
    .eq('username', username)
    .maybeSingle()

  if (error) {
    console.error('Login DB error:', error.message)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server.' },
      { status: 500 }
    )
  }

  if (!data || data.password !== password) {
    return NextResponse.json(
      { success: false, message: 'Username atau password salah.' },
      { status: 401 }
    )
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set('admin_session', `${data.id}:${data.username}`, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 8, // 8 jam
    sameSite: 'strict',
  })

  return NextResponse.json({ success: true })
}
