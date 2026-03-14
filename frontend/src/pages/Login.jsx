import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill in all fields')
    try {
      setLoading(true)
      const res = await loginUser(form)
      login(res.data.token)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>{isAdminLogin ? 'Sign in to admin dashboard' : 'Sign in to your account'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 p-1 bg-secondary rounded-lg mb-6">
            <button type="button" className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${!isAdminLogin ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setIsAdminLogin(false)}>Customer</button>
            <button type="button" className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${isAdminLogin ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setIsAdminLogin(true)}>Admin</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="john@gmail.com" value={form.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" placeholder="••••••" value={form.password} onChange={handleChange} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
