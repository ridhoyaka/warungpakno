import type { MenuItem } from './supabase'

export type { MenuItem }

export type CartItem = {
  menuItem: MenuItem
  quantity: number
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem('warungpakno_cart')
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('warungpakno_cart', JSON.stringify(cart))
}

export function addToCart(item: MenuItem): CartItem[] {
  const cart = getCart()
  const existing = cart.find(c => c.menuItem.id === item.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ menuItem: item, quantity: 1 })
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(itemId: number): CartItem[] {
  const cart = getCart().filter(c => c.menuItem.id !== itemId)
  saveCart(cart)
  return cart
}

export function updateQuantity(itemId: number, qty: number): CartItem[] {
  let cart = getCart()
  if (qty <= 0) {
    cart = cart.filter(c => c.menuItem.id !== itemId)
  } else {
    const item = cart.find(c => c.menuItem.id === itemId)
    if (item) item.quantity = qty
  }
  saveCart(cart)
  return cart
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('warungpakno_cart')
}

export function getTotalPrice(cart: CartItem[]): number {
  return cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0)
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
