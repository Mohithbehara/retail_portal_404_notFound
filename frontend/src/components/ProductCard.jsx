import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const ProductCard = ({ product }) => {
  const { user } = useAuth()
  const { addItem } = useCart()

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }
    try {
      await addItem(product._id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="overflow-hidden group cursor-pointer hover:border-primary/30 transition-all duration-300 animate-fade-in">
        <div className="relative h-48 overflow-hidden bg-secondary">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-secondary to-primary/10">📦</div>
          )}
          {product.stock <= 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">Out of Stock</Badge>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</p>
          <h3 className="font-bold text-sm text-foreground line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-extrabold text-emerald-400">₹{product.price}</span>
            {product.stock > 0 && (
              <Button size="icon" className="rounded-full h-9 w-9 shadow-lg shadow-primary/25" onClick={handleAddToCart}>
                <ShoppingCart size={16} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default ProductCard
