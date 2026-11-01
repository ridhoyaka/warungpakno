'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  CartItem,
  MenuItem,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCart,
} from '@/lib/cart'

type CartContextType = {
  cart: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (id: number) => void
  updateItem: (id: number, qty: number) => void
  clearAll: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(getCart())
  }, [])

  function addItem(item: MenuItem) {
    setCart(addToCart(item))
  }

  function removeItem(id: number) {
    setCart(removeFromCart(id))
  }

  function updateItem(id: number, qty: number) {
    setCart(updateQuantity(id, qty))
  }

  function clearAll() {
    clearCart()
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateItem, clearAll }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
