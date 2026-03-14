import { useState, useEffect } from 'react'
import { Package, Plus, Edit3 } from 'lucide-react'
import { createCategory, getAllCategories } from '@/services/categoryService'
import { createProduct, getAllProducts, updateProductStock } from '@/services/productService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [catForm, setCatForm] = useState({ name: '', description: '' })
  const [catLoading, setCatLoading] = useState(false)
  const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', stock: '', category: '' })
  const [prodImage, setProdImage] = useState(null)
  const [prodLoading, setProdLoading] = useState(false)
  const [editStock, setEditStock] = useState({})

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([getAllCategories(), getAllProducts(1, 100)])
      setCategories(catRes.data)
      setProducts(prodRes.data.products)
    } catch (err) { console.error(err) }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!catForm.name) return toast.error('Category name is required')
    try {
      setCatLoading(true)
      await createCategory(catForm)
      toast.success('Category created!')
      setCatForm({ name: '', description: '' })
      const res = await getAllCategories()
      setCategories(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category')
    } finally { setCatLoading(false) }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    if (!prodForm.name || !prodForm.price || !prodForm.category) return toast.error('Name, price, and category are required')
    try {
      setProdLoading(true)
      const formData = new FormData()
      formData.append('name', prodForm.name)
      formData.append('description', prodForm.description)
      formData.append('price', prodForm.price)
      formData.append('stock', prodForm.stock || 0)
      formData.append('category', prodForm.category)
      if (prodImage) formData.append('image', prodImage)
      await createProduct(formData)
      toast.success('Product created!')
      setProdForm({ name: '', description: '', price: '', stock: '', category: '' })
      setProdImage(null)
      const res = await getAllProducts(1, 100)
      setProducts(res.data.products)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally { setProdLoading(false) }
  }

  const handleUpdateStock = async (productId) => {
    const newStock = editStock[productId]
    if (newStock === undefined || newStock < 0) return toast.error('Invalid stock value')
    try {
      await updateProductStock(productId, parseInt(newStock))
      toast.success('Stock updated!')
      setEditStock({ ...editStock, [productId]: undefined })
      const res = await getAllProducts(1, 100)
      setProducts(res.data.products)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update stock') }
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-slide-up">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage categories, products, and inventory</p>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products" className="gap-1.5"><Package size={16} /> Products</TabsTrigger>
          <TabsTrigger value="categories" className="gap-1.5"><Plus size={16} /> Categories</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-1.5"><Edit3 size={16} /> Inventory</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader><CardTitle>Create Product</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input placeholder="Veg Burger" value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}>
                      <option value="">Select category</option>
                      {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px] resize-y" placeholder="Product description..." value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" min="0" placeholder="120" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" min="0" placeholder="20" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <Input type="file" accept="image/*" onChange={(e) => setProdImage(e.target.files[0])} />
                </div>
                <Button type="submit" disabled={prodLoading}>{prodLoading ? 'Creating...' : 'Create Product'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader><CardTitle>Create Category</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input placeholder="Burgers" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="All burger items" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
                  </div>
                </div>
                <Button type="submit" disabled={catLoading}>{catLoading ? 'Creating...' : 'Create Category'}</Button>
              </form>

              <div className="mt-8 border-t border-border pt-6">
                <h3 className="font-bold mb-4">Existing Categories</h3>
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <div key={cat._id} className="p-3 rounded-lg bg-secondary border border-border">
                        <p className="font-semibold text-sm">{cat.name}</p>
                        <p className="text-muted-foreground text-xs">{cat.description || '—'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No categories yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader><CardTitle>Manage Inventory</CardTitle></CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <div className="space-y-0 divide-y divide-border">
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_2fr] gap-3 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <span>Product</span><span>Price</span><span>Stock</span><span>Update</span>
                  </div>
                  {products.map((prod) => (
                    <div key={prod._id} className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_2fr] gap-3 items-center py-3">
                      <span className="font-semibold text-sm">{prod.name}</span>
                      <span className="text-sm">₹{prod.price}</span>
                      <span className="text-sm">
                        {prod.stock <= 5 ? <Badge variant="destructive">{prod.stock}</Badge> : prod.stock}
                      </span>
                      <div className="flex gap-2 items-center">
                        <Input type="number" min="0" className="w-24 h-8 text-sm" placeholder="New stock" value={editStock[prod._id] ?? ''} onChange={(e) => setEditStock({ ...editStock, [prod._id]: e.target.value })} />
                        <Button size="sm" onClick={() => handleUpdateStock(prod._id)}>Update</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No products yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard
