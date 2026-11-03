import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export function useLogout() {
  const { logout } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  return useCallback(() => {
    logout()
    navigate('/login', { replace: true })
    notify('You have been signed out of the demo.', 'info')
  }, [logout, navigate, notify])
}
