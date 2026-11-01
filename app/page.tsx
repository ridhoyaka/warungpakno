import { supabase } from '@/lib/supabase'
import type { MenuCategory, MenuItem } from '@/lib/supabase'
import MenuSection from '@/components/MenuSection'
import Header from '@/components/Header'
import { CartProvider } from '@/context/CartContext'

export const dynamic = 'force-dynamic'

async function getMenuData() {
  try {
    const { data: categories } = await supabase
      .from('menu_categories')
      .select('*')
      .order('id')

    const { data: items } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('id')

    return {
      categories: (categories as MenuCategory[]) || [],
      items: (items as MenuItem[]) || [],
    }
  } catch {
    return { categories: [], items: [] }
  }
}

export default async function HomePage() {
  const { categories, items } = await getMenuData()

  return (
    <CartProvider>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Menu Kami</h1>
          <p className="text-gray-500 text-sm mt-1">Reservasi langsung melalui WhatsApp kami.</p>
        </section>

        {/* Menu Sections */}
        {categories.map(category => {
          const categoryItems = items.filter(item => item.category_id === category.id)
          return (
            <MenuSection
              key={category.id}
              category={category}
              items={categoryItems}
            />
          )
        })}

        {categories.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 text-sm">Menu sedang dimuat...</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">Lokasi Warung : Pasar Tawangsari (Depan Tokomas Sahabat) Sukoharjo</p>
          <p className="text-xs text-gray-400"></p>
        </div>
      </footer>
    </CartProvider>
  )
}
