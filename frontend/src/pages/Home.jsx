import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative text-center max-w-2xl animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary border border-border text-sm text-muted-foreground mb-6">
            🎉 Welcome to Retail Portal
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Discover Amazing{' '}
            <span className="bg-gradient-to-r from-primary to-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Products
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-9 leading-relaxed">
            Browse our curated collection of quality products. Add to cart, manage your orders, and enjoy a seamless shopping experience.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" asChild>
              <Link to="/products">Browse Products <ArrowRight size={18} /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShoppingBag />, title: 'Wide Selection', desc: 'Browse through categories of amazing products curated just for you.' },
            { icon: <Truck />, title: 'Fast Delivery', desc: 'Get your products delivered quickly with our reliable shipping.' },
            { icon: <Shield />, title: 'Secure Shopping', desc: 'Your data is safe with our encrypted and secure platform.' },
          ].map((f) => (
            <Card key={f.title} className="p-8 text-center animate-fade-in hover:border-primary/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-5">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
