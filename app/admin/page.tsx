import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { MenuCategory, MenuItem } from '@/lib/supabase'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  // Auth check
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session?.value) {
    redirect('/login')
  }

  const { data: categories } = await supabase.from('menu_categories').select('*').order('id')
  const { data: items } = await supabase.from('menu_items').select('*').order('id')

  return (
    <AdminClient
      categories={(categories as MenuCategory[]) || []}
      items={(items as MenuItem[]) || []}
    />
  )
}
