import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react'
import { getProductById } from '@/services/productService'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProductById(id)
        setProduct(res.data)
      } catch { toast.error('Product not found') }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) return toast.error('Please login to add items to cart')
    try {
      await addItem(product._id, quantity)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 border-3 border-border border-t-primary rounded-full animate-spin" /></div>
  if (!product) return <div className="container mx-auto px-4 py-10"><p>Product not found</p></div>

  return (
    <div className="container mx-auto px-4 py-10 animate-slide-up">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <Card className="overflow-hidden aspect-square flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">📦</span>
          )}
        </Card>

        <div className="py-2">
          <Badge variant="secondary" className="text-primary mb-4">{product.category?.name || 'Uncategorized'}</Badge>
          <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>
          <p className="text-muted-foreground leading-relaxed mb-6">{product.description || 'No description available.'}</p>

          <div className="flex items-center gap-5 mb-6">
            <span className="text-3xl font-extrabold text-emerald-400">₹{product.price}</span>
            <Badge variant={product.stock > 0 ? 'success' : 'destructive'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Badge>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={16} />
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                  <Plus size={16} />
                </Button>
              </div>
              <Button size="lg" onClick={handleAddToCart}>
                <ShoppingCart size={18} /> Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
