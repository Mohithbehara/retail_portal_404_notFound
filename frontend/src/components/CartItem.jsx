import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart()
  const product = item.product

  const handleQuantity = async (newQty) => {
    if (newQty < 1) return
    try {
      await updateItem(product._id, newQty)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    }
  }

  const handleRemove = async () => {
    try {
      await removeItem(product._id)
      toast.success(`${product.name} removed from cart`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove')
    }
  }

  return (
    <Card className="flex items-center gap-4 p-4 mb-3 animate-fade-in">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-muted-foreground text-sm">₹{product.price}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center border border-border rounded-lg bg-background">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantity(item.quantity - 1)}>
            <Minus size={14} />
          </Button>
          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantity(item.quantity + 1)}>
            <Plus size={14} />
          </Button>
        </div>
        <p className="text-emerald-400 text-sm font-bold">₹{product.price * item.quantity}</p>
      </div>
      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0" onClick={handleRemove}>
        <Trash2 size={16} />
      </Button>
    </Card>
  )
}

export default CartItem
