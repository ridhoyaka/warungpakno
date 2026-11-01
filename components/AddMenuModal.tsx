'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import type { MenuCategory, MenuItem } from '@/lib/supabase'
import { formatRupiah } from '@/lib/cart'
import ImageUploader from './ImageUploader'

type Props = {
  categories: MenuCategory[]
  onClose: () => void
  onAdded: (item: MenuItem) => void
}

export default function AddMenuModal({ categories, onClose, onAdded }: Props) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id?.toString() ?? '')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!name.trim()) { setError('Nama menu tidak boleh kosong.'); return }
    if (!categoryId) { setError('Pilih kategori terlebih dahulu.'); return }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Harga harus berupa angka positif.')
      return
    }
    if (!imageUrl) { setError('Silakan upload gambar menu terlebih dahulu.'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: Number(categoryId),
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          image_url: imageUrl,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        onAdded(data.data as MenuItem)
      } else {
        setError(data.error || 'Gagal menambahkan menu.')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-yellow-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Tambah Menu Baru</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Tutup">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Image uploader */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Menu <span className="text-red-400">*</span>
            </label>
            <ImageUploader
              currentUrl={imageUrl}
              onUploaded={url => { setImageUrl(url); setError('') }}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 bg-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Contoh: Ayam Kremes Spesial"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Deskripsi singkat menu..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga (Rp)
              {price && !isNaN(Number(price)) && Number(price) > 0
                ? ` - ${formatRupiah(Number(price))}`
                : ''}
            </label>
            <input
              type="number"
              value={price}
              onChange={e => { setPrice(e.target.value); setError('') }}
              min={0}
              placeholder="Contoh: 18000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2 sticky bottom-0 bg-white border-t border-yellow-100 pt-3 z-10">
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
            <Plus size={16} />
            {loading ? 'Menyimpan...' : 'Tambah Menu'}
          </button>
        </div>
      </div>
    </div>
  )
}
