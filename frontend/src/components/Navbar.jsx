import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, LogOut, Menu, X, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl">🛒</span>
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            RetailPortal
          </span>
        </Link>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`${menuOpen ? 'flex absolute top-16 left-0 right-0 flex-col bg-background border-b border-border p-4 gap-2' : 'hidden'} md:flex md:relative md:top-0 md:flex-row md:border-0 md:p-0 md:bg-transparent items-center gap-2`}>
          <Link to="/products" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="px-3 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-400/10 transition-colors rounded-md flex items-center gap-1.5" onClick={() => setMenuOpen(false)}>
                  <Shield size={16} /> Admin
                </Link>
              )}
              <Link to="/orders" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent" onClick={() => setMenuOpen(false)}>
                Orders
              </Link>
              <Link to="/cart" className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent flex items-center gap-1.5" onClick={() => setMenuOpen(false)}>
                <ShoppingCart size={16} />
                Cart
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {itemCount}
                  </Badge>
                )}
              </Link>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Button size="sm" asChild>
                <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
