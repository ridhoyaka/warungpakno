'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatRupiah, getTotalPrice } from '@/lib/cart'
import OrderModal from '@/components/OrderModal'

export default function CheckoutClient() {
  const { cart, removeItem, updateItem, clearAll } = useCart()
  const [showModal, setShowModal] = useState(false)
  const total = getTotalPrice(cart)

  if (cart.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} className="text-gray-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Keranjang Kosong</h2>
        <p className="text-gray-400 text-sm mb-6">Belum ada menu yang dipilih.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          Lihat Menu
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Keranjang</h1>
        <span className="ml-auto text-sm text-gray-400">{cart.length} item</span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2 mb-6">
        {cart.map(({ menuItem, quantity }) => (
          <div
            key={menuItem.id}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3"
          >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={menuItem.image_url}
                alt={menuItem.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{menuItem.name}</p>
              <p className="text-amber-600 text-sm font-semibold mt-0.5">{formatRupiah(menuItem.price)}</p>
            </div>

            {/* Qty */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateItem(menuItem.id, quantity - 1)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                aria-label="Kurangi"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-semibold w-5 text-center tabular-nums">{quantity}</span>
              <button
                onClick={() => updateItem(menuItem.id, quantity + 1)}
                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
                aria-label="Tambah"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={() => removeItem(menuItem.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
              aria-label="Hapus"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>Subtotal ({cart.reduce((s, c) => s + c.quantity, 0)} item)</span>
          <span>{formatRupiah(total)}</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-bold text-gray-900 text-lg">{formatRupiah(total)}</span>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        Pesan via WhatsApp
      </button>

      {showModal && (
        <OrderModal
          cart={cart}
          total={total}
          onClose={() => setShowModal(false)}
          onSuccess={() => { clearAll(); setShowModal(false) }}
        />
      )}
    </main>
  )
}
