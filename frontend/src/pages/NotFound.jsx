import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-8xl font-extrabold text-foreground/20 mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page not found</p>
      <Button asChild><Link to="/">Go Home</Link></Button>
    </div>
  )
}

export default NotFound
