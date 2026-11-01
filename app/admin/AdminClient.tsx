'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Pencil, LogOut, Eye, EyeOff, Plus, Trash2, FolderPlus } from 'lucide-react'
import type { MenuCategory, MenuItem } from '@/lib/supabase'
import { formatRupiah } from '@/lib/cart'
import EditMenuModal from '@/components/EditMenuModal'
import AddMenuModal from '@/components/AddMenuModal'
import CategoryModal from '@/components/CategoryModal'

type Props = {
  categories: MenuCategory[]
  items: MenuItem[]
}

export default function AdminClient({ categories: initialCategories, items: initialItems }: Props) {
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)
  const [items, setItems] = useState<MenuItem[]>(initialItems)

  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editCategory, setEditCategory] = useState<MenuCategory | null>(null)

  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null)
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null)

  const router = useRouter()

  async function handleToggleAvailable(item: MenuItem) {
    setLoadingId(item.id)
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_available: !item.is_available }),
      })
      if (res.ok) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: !i.is_available } : i))
      }
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDeleteItem(item: MenuItem) {
    if (!confirm(`Hapus menu "${item.name}"?`)) return
    setDeletingItemId(item.id)
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
      if (res.ok) setItems(prev => prev.filter(i => i.id !== item.id))
    } finally {
      setDeletingItemId(null)
    }
  }

  async function handleDeleteCategory(cat: MenuCategory) {
    const count = items.filter(i => i.category_id === cat.id).length
    const msg = count > 0
      ? `Hapus kategori "${cat.name}"? ${count} menu di dalamnya juga akan dihapus.`
      : `Hapus kategori "${cat.name}"?`
    if (!confirm(msg)) return

    setDeletingCatId(cat.id)
    try {
      const res = await fetch('/api/admin/category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id }),
      })
      if (res.ok) {
        setItems(prev => prev.filter(i => i.category_id !== cat.id))
        setCategories(prev => prev.filter(c => c.id !== cat.id))
      }
    } finally {
      setDeletingCatId(null)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/login')
  }

  function handleItemSaved(updated: MenuItem) {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
    setEditItem(null)
  }

  function handleItemAdded(newItem: MenuItem) {
    setItems(prev => [...prev, newItem])
    setShowAddMenu(false)
  }

  function handleCategorySaved(cat: MenuCategory, isNew: boolean) {
    if (isNew) {
      setCategories(prev => [...prev, cat])
    } else {
      setCategories(prev => prev.map(c => c.id === cat.id ? cat : c))
    }
    setShowAddCategory(false)
    setEditCategory(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src="/logopakno.jpeg"
                alt="Warung Pak No"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">Warung Pak No</p>
              <p className="text-xs text-gray-400 leading-tight">Panel Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Page Title + Actions */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Kelola Menu</h1>
            <p className="text-sm text-gray-400 mt-0.5">{items.length} menu · {categories.length} kategori</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddCategory(true)}
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FolderPlus size={15} />
              <span className="hidden sm:inline">Kategori</span>
            </button>
            <button
              onClick={() => setShowAddMenu(true)}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Tambah Menu</span>
            </button>
          </div>
        </div>

        {/* Empty state */}
        {categories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FolderPlus size={20} className="text-gray-400" />
            </div>
            <p className="font-medium text-gray-700 mb-1">Belum ada kategori</p>
            <p className="text-sm text-gray-400">Mulai dengan menambahkan kategori baru.</p>
          </div>
        )}

        {/* Categories */}
        {categories.map(category => {
          const categoryItems = items.filter(i => i.category_id === category.id)
          return (
            <section key={category.id} className="mb-8">
              {/* Category header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-gray-800 text-sm">{category.name}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {categoryItems.length} menu
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditCategory(category)}
                    title="Edit kategori"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    disabled={deletingCatId === category.id}
                    title="Hapus kategori"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Menu items */}
              <div className="flex flex-col gap-2">
                {categoryItems.length === 0 && (
                  <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-sm text-gray-400">Belum ada menu di kategori ini.</p>
                  </div>
                )}

                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 bg-white border rounded-xl p-3 transition-all ${
                      item.is_available ? 'border-gray-200' : 'border-gray-200 opacity-50'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image_url || '/menu/ayamkremes.jpeg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                        {!item.is_available && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                            Disembunyikan
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{item.description}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatRupiah(item.price)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        disabled={loadingId === item.id}
                        title={item.is_available ? 'Sembunyikan' : 'Tampilkan'}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                          item.is_available
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {item.is_available ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>

                      <button
                        onClick={() => setEditItem(item)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item)}
                        disabled={deletingItemId === item.id}
                        title="Hapus"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {editItem && (
        <EditMenuModal item={editItem} onClose={() => setEditItem(null)} onSaved={handleItemSaved} />
      )}
      {showAddMenu && (
        <AddMenuModal categories={categories} onClose={() => setShowAddMenu(false)} onAdded={handleItemAdded} />
      )}
      {(showAddCategory || editCategory) && (
        <CategoryModal
          category={editCategory}
          onClose={() => { setShowAddCategory(false); setEditCategory(null) }}
          onSaved={handleCategorySaved}
        />
      )}
    </div>
  )
}
