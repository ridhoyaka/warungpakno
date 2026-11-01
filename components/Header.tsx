'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { cart } = useCart()
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src="/logopakno.jpeg"
              alt="Warung Pak No"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">Warung Pak No</p>
            <p className="text-xs text-gray-400 leading-tight">Special Kremes & Penyetan</p>
          </div>
        </Link>

        <Link
          href="/checkout"
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Keranjang belanja"
        >
          <ShoppingCart size={22} className="text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-white text-xs font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center leading-none px-1">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
