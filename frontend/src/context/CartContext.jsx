import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import * as cartService from '@/services/cartService'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], totalPrice: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    if (!user) { setCart({ items: [], totalPrice: 0 }); return }
    try {
      setLoading(true)
      const res = await cartService.getCart()
      setCart(res.data)
    } catch { setCart({ items: [], totalPrice: 0 }) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCart() }, [user])

  const addItem = async (productId, quantity = 1) => {
    const res = await cartService.addToCart(productId, quantity)
    setCart(res.data)
    return res.data
  }

  const updateItem = async (productId, quantity) => {
    const res = await cartService.updateCartItem(productId, quantity)
    setCart(res.data)
    return res.data
  }

  const removeItem = async (productId) => {
    const res = await cartService.removeFromCart(productId)
    setCart(res.data)
    return res.data
  }

  const clearCart = () => setCart({ items: [], totalPrice: 0 })

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, loading, itemCount, addItem, updateItem, removeItem, fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
