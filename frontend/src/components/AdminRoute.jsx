import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <div className="flex justify-center py-20"><div className="h-8 w-8 border-2 border-border border-t-primary rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

export default AdminRoute
