import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserOrders } from '@/services/orderService'
import { useCart } from '@/context/CartContext'
import { Package, Clock, RotateCcw, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [reorderingId, setReorderingId] = useState(null)
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await getUserOrders()
      setOrders(res.data)
    } catch (err) {
      toast.error('Failed to fetch order history')
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (order) => {
    try {
      setReorderingId(order._id)
      
      // Loop through past items and add to cart sequentially to prevent race conditions
      for (const item of order.items) {
        if (item.product && item.product._id) {
          await addItem(item.product._id, item.quantity)
        }
      }
      
      toast.success('Items added to your cart!')
      navigate('/cart')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Some items could not be reordered')
    } finally {
      setReorderingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-10 w-10 border-3 border-border border-t-primary rounded-full animate-spin" /></div>
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-slide-up">
      <div className="flex items-center gap-3 mb-1">
        <Package className="text-primary" size={32} />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Order History
        </h1>
      </div>
      <p className="text-muted-foreground mb-8">View your past purchases and reorder items easily</p>

      {orders.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center border-dashed">
          <Clock size={48} className="text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No previous orders</h3>
          <p className="text-muted-foreground mb-6">Looks like you haven't bought anything yet.</p>
          <Button onClick={() => navigate('/products')}>Start Shopping</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <div className="bg-secondary/50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                    <span>Order #{order._id.substring(18).toUpperCase()}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">Total: ₹{order.totalPrice}</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {order.paymentMethod}
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleReorder(order)} 
                  disabled={reorderingId === order._id}
                  className="w-full md:w-auto gap-2"
                >
                  {reorderingId === order._id ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
                  {reorderingId === order._id ? 'Reordering...' : 'Reorder Items'}
                </Button>
              </div>
              
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 sm:p-6 transition-colors hover:bg-secondary/20">
                      {item.product?.imageUrl ? (
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-secondary shrink-0">
                          <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-secondary flex items-center justify-center shrink-0">
                          <Package className="text-muted-foreground" size={24} />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{item.product?.name || 'Unknown Product'}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      
                      <div className="text-right font-medium">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
