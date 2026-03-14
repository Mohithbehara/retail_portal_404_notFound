import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { Link } from 'react-router-dom'
import { ShoppingBag, CreditCard, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CartItem from '@/components/CartItem'
import { placeOrder } from '@/services/orderService'
import { getAllCategories } from '@/services/categoryService'
import { getAllProducts } from '@/services/productService'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, loading, clearCart, addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [shipping, setShipping] = useState({ fullName: user?.name || '', address: '', city: '', postalCode: '', phone: '' })
  const [checkoutMode, setCheckoutMode] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [addons, setAddons] = useState([])
  const [addingAddonId, setAddingAddonId] = useState(null)

  useEffect(() => {
    if (user) fetchAddons()
  }, [user])

  const fetchAddons = async () => {
    try {
      const catRes = await getAllCategories()
      const addonCategory = catRes.data.find(c => c.name.toLowerCase() === 'addons' || c.name.toLowerCase() === 'add-ons')
      
      if (addonCategory) {
        const prodRes = await getAllProducts(1, 12, '', addonCategory._id)
        setAddons(prodRes.data.products)
      }
    } catch (err) {
      console.error('Failed to fetch addons', err)
    }
  }

  const handleAddAddon = async (productId) => {
    try {
      setAddingAddonId(productId)
      await addItem(productId, 1)
      toast.success('Added to cart')
    } catch (err) {
      toast.error('Failed to add item')
    } finally {
      setAddingAddonId(null)
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.phone) {
      return toast.error('Please fill in all shipping details')
    }

    try {
      setOrderLoading(true)
      await placeOrder({ shippingAddress: shipping })
      clearCart()
      toast.success('Order placed successfully! Check your email for confirmation.')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally {
      setOrderLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-muted-foreground">Please login to view your cart</p>
        <Button asChild><Link to="/login">Sign In</Link></Button>
      </div>
    )
  }

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 border-3 border-border border-t-primary rounded-full animate-spin" /></div>

  // Filter out addons that are already in the cart
  const availableAddons = addons.filter(addon => 
    !cart.items?.some(item => item.product?._id === addon._id)
  )

  return (
    <div className="container mx-auto px-4 py-10 animate-slide-up">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-1">
        {checkoutMode ? 'Checkout' : 'Shopping Cart'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {checkoutMode ? 'Enter your shipping details' : (cart.items?.length > 0 ? `${cart.items.length} item${cart.items.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty')}
      </p>

      {cart.items?.length > 0 ? (
        <div className="space-y-12">
          {/* Top Section: Cart grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">
            
            {/* Main Content Area */}
            <div>
              {!checkoutMode ? (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem key={item.product?._id || item._id} item={item} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
                  <CardContent>
                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Street Address</Label>
                        <Input placeholder="123 Main St, Apt 4B" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City</Label>
                          <Input placeholder="Mumbai" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>ZIP / Postal Code</Label>
                          <Input placeholder="400001" value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input type="tel" placeholder="+91 9876543210" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Sidebar - Sticky Summary */}
            <Card className="p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-5">Order Summary</h3>
              
              {checkoutMode && (
                <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-2">
                  {cart.items.map(item => (
                    <div key={item._id} className="flex justify-between text-sm items-center gap-4">
                      <span className="truncate flex-1 text-muted-foreground">{item.quantity}x {item.product?.name}</span>
                      <span className="shrink-0">₹{item.product?.price * item.quantity}</span>
                    </div>
                  ))}
                  <Separator className="my-3" />
                </div>
              )}

              <div className="flex justify-between text-sm text-muted-foreground mb-3">
                <span>Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>₹{cart.totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">Free</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-extrabold text-lg mb-6">
                <span>Total</span>
                <span>₹{cart.totalPrice}</span>
              </div>

              {!checkoutMode ? (
                <Button className="w-full gap-2 text-md h-12" onClick={() => setCheckoutMode(true)}>
                  Proceed to Checkout
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button type="submit" form="checkout-form" className="w-full gap-2 text-md h-12" disabled={orderLoading}>
                    {orderLoading ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                    {orderLoading ? 'Processing...' : 'Place Order (COD)'}
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setCheckoutMode(false)} disabled={orderLoading}>
                    Back to Cart
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Bottom Section: Suggested Addons */}
          {!checkoutMode && availableAddons.length > 0 && (
            <div className="pt-8 border-t border-border animate-fade-in">
              <div className="mb-6">
                <h3 className="text-xl font-bold">Suggested Add-ons</h3>
                <p className="text-sm text-muted-foreground">Perfect pairs for your purchase</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableAddons.map(addon => (
                  <Card key={addon._id} className="overflow-hidden flex flex-col group border-border/50 hover:border-primary/30 transition-colors">
                    <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                      {addon.imageUrl ? (
                        <img src={addon.imageUrl} alt={addon.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                          <ShoppingBag size={24} opacity={0.5} />
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h4 className="font-semibold text-sm truncate mb-1" title={addon.name}>{addon.name}</h4>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="font-bold text-sm text-primary">₹{addon.price}</span>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-7 px-2"
                          onClick={() => handleAddAddon(addon._id)}
                          disabled={addingAddonId === addon._id}
                        >
                          {addingAddonId === addon._id ? <Loader2 className="animate-spin w-3 h-3" /> : <Plus className="w-3 h-3 mr-1" />}
                          Add
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <ShoppingBag size={48} className="text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Your cart is empty</p>
          <Button asChild><Link to="/products">Browse Products</Link></Button>
        </div>
      )}
    </div>
  )
}

export default Cart
