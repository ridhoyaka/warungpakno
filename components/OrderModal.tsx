'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { CartItem, formatRupiah } from '@/lib/cart'

type Props = {
  cart: CartItem[]
  total: number
  onClose: () => void
  onSuccess: () => void
}

export default function OrderModal({ cart, total, onClose, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [error, setError] = useState('')

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'

  function buildMessage(): string {
    const items = cart
      .map(c => `  - ${c.menuItem.name} x${c.quantity} = ${formatRupiah(c.menuItem.price * c.quantity)}`)
      .join('\n')

    return (
      `*Pesanan Warung Pak No*\n\n` +
      `Nama: ${name}\n` +
      `Jam Kedatangan: ${arrivalTime}\n\n` +
      `*Menu:*\n${items}\n\n` +
      `*Total: ${formatRupiah(total)}*`
    )
  }

  function handleOrder() {
    if (!name.trim()) { setError('Nama tidak boleh kosong.'); return }
    if (!arrivalTime.trim()) { setError('Jam kedatangan tidak boleh kosong.'); return }

    const message = encodeURIComponent(buildMessage())
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank')
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Detail Pesanan</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Tutup">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          {/* Order summary */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Ringkasan</p>
            {cart.map(c => (
              <div key={c.menuItem.id} className="flex justify-between text-sm py-0.5">
                <span className="text-gray-700">{c.menuItem.name} <span className="text-gray-400">x{c.quantity}</span></span>
                <span className="text-gray-900 font-medium">{formatRupiah(c.menuItem.price * c.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-bold text-gray-900">{formatRupiah(total)}</span>
            </div>
          </div>

          {/* Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemesan</label>
            <input
              type="text"
              placeholder="Masukkan nama Anda"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kedatangan</label>
            <input
              type="text"
              placeholder="Contoh: 12.30 atau Sekarang"
              value={arrivalTime}
              onChange={e => { setArrivalTime(e.target.value); setError('') }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleOrder}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <MessageCircle size={16} />
            Kirim Pesanan
          </button>
        </div>
      </div>
    </div>
  )
}
