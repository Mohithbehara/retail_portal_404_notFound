import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getAllProducts } from '@/services/productService'
import { getAllCategories } from '@/services/categoryService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getAllProducts(page, 12, searchQuery, selectedCategory)
      setProducts(res.data.products)
      setTotalPages(res.data.totalPages)
    } catch (err) {
      console.error('Failed to fetch products', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  useEffect(() => { fetchCategories() }, [])
  
  // Refetch when page, actual applied search query, or category filter changes
  useEffect(() => { 
    fetchProducts() 
  }, [page, searchQuery, selectedCategory])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory])

  const handleSearch = (e) => {
    e.preventDefault()
    
    // Check for #CategoryName shortcut
    if (searchInput.startsWith('#')) {
      const catName = searchInput.substring(1).trim().toLowerCase()
      
      if (catName === 'all') {
        setSelectedCategory('')
        setSearchInput('')
        setSearchQuery('')
        return
      }

      const match = categories.find(c => c.name.toLowerCase() === catName)
      
      if (match) {
        setSelectedCategory(match._id)
        setSearchInput('')
        setSearchQuery('')
        return
      }
    }
    
    setSearchQuery(searchInput)
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Products</h1>
          <p className="text-muted-foreground mt-1">Browse our collection</p>
        </div>
        <form className="flex items-center gap-2 bg-secondary border border-border rounded-lg pl-3 pr-1 py-1 min-w-[280px] md:min-w-[320px] focus-within:ring-1 focus-within:ring-ring transition-all" onSubmit={handleSearch}>
          <Search size={18} className="text-muted-foreground flex-shrink-0" />
          <Input className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-8" placeholder="Search products..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <Button type="submit" size="sm">Search</Button>
        </form>
      </div>

      <CategoryFilter categories={categories} selected={selectedCategory} onSelect={(id) => setSelectedCategory(id || '')} />

      {loading ? (
        <div className="flex justify-center py-20"><div className="h-10 w-10 border-3 border-border border-t-primary rounded-full animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-lg">😕 No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
