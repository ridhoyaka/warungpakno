import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session?.value
}

// POST — tambah kategori baru
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, slug } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'Nama dan slug wajib diisi.' }, { status: 400 })
  }

  // Validasi slug: lowercase, hanya huruf dan angka dan strip
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('menu_categories')
    .insert({ name, slug: cleanSlug })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug sudah digunakan, coba nama lain.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

// PUT — edit kategori
export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id, name, slug } = body

  if (!id || !name || !slug) {
    return NextResponse.json({ error: 'ID, nama, dan slug wajib diisi.' }, { status: 400 })
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('menu_categories')
    .update({ name, slug: cleanSlug })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Slug sudah digunakan.' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

// DELETE — hapus kategori (beserta semua menu di dalamnya via CASCADE)
export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'ID kategori diperlukan.' }, { status: 400 })
  }

  const supabase = getServiceClient()
  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
