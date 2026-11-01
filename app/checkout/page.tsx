import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import CheckoutClient from './CheckoutClient'

export default function CheckoutPage() {
  return (
    <CartProvider>
      <Header />
      <CheckoutClient />
    </CartProvider>
  )
}
