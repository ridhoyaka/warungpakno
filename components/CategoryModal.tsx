'use client'

import { useState, useEffect } from 'react'
import { X, Save, Plus } from 'lucide-react'
import type { MenuCategory } from '@/lib/supabase'

type Props = {
  /** Kalau diisi = mode edit, kalau null = mode tambah */
  category?: MenuCategory | null
  onClose: () => void
  onSaved: (cat: MenuCategory, isNew: boolean) => void
}

export default function CategoryModal({ category, onClose, onSaved }: Props) {
  const isEdit = !!category

  const [name, setName] = useState(category?.name ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate slug dari nama saat mode tambah
  useEffect(() => {
    if (!isEdit) {
      setSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
    }
  }, [name, isEdit])

  async function handleSubmit() {
    if (!name.trim()) { setError('Nama kategori tidak boleh kosong.'); return }
    if (!slug.trim()) { setError('Slug tidak boleh kosong.'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/category', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(isEdit ? { id: category!.id } : {}),
          name: name.trim(),
          slug: slug.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onSaved(data.data as MenuCategory, !isEdit)
      } else {
        setError(data.error || 'Gagal menyimpan kategori.')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-yellow-100">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Tutup">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Contoh: Minuman"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-gray-400 font-normal">(URL identifier)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => { setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setError('') }}
              placeholder="Contoh: minuman"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Hanya huruf kecil, angka, dan tanda -</p>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-gray-900 py-2.5 rounded-lg text-sm font-bold transition-colors"
          >
            {isEdit ? <Save size={16} /> : <Plus size={16} />}
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  )
}
