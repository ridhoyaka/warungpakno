'use client'

import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { MenuItem, formatRupiah } from '@/lib/cart'
import { useCart } from '@/context/CartContext'

type Props = {
  item: MenuItem
}

export default function MenuCard({ item }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(item)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-square bg-gray-50">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3">
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</h3>
        <p className="text-xs text-gray-400 mt-1 flex-1 leading-relaxed line-clamp-2">{item.description}</p>
        <p className="font-semibold text-gray-900 text-sm mt-2">{formatRupiah(item.price)}</p>

        <button
          onClick={handleAdd}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150
            ${added
              ? 'bg-green-500 text-white'
              : 'bg-amber-400 hover:bg-amber-500 text-gray-900'
            }`}
        >
          {added ? (
            <>
              <Check size={14} />
              Ditambahkan
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              Tambah
            </>
          )}
        </button>
      </div>
    </div>
  )
}
