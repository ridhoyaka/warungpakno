import { MenuCategory, MenuItem } from '@/lib/supabase'
import MenuCard from './MenuCard'

type Props = {
  category: MenuCategory
  items: MenuItem[]
}

export default function MenuSection({ category, items }: Props) {
  if (items.length === 0) return null

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-base font-semibold text-gray-900 whitespace-nowrap">{category.name}</h2>
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 whitespace-nowrap">{items.length} menu</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(item => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
