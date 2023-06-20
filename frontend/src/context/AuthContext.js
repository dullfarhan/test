
// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import toast from 'react-hot-toast';

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),

  // register: () => Promise.resolve(),
  mail: () => Promise.resolve(),
  resetpassword: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {

  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const { token } = router.query;

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const userData = window.localStorage.getItem('userData')
      if (storedToken) {
        setLoading(false)
        setUser(userData)
      } else {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('token')
        setUser(null)
        setLoading(false)
        if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
          router.replace('/login')
        }
      }
    }
    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    await axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        if (response && response.status === 200) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
          window.localStorage.setItem('userData', JSON.stringify(response.data.userData))
          toast.success('Login successfully')
        }
        setUser(response.data.userData)
        const role = response.data.userData.role
        if (role === 'basic') {
          router.replace('/basic')
        } else if (role === 'carniqUser') {
          router.replace('/dashboard')
        } else if (role === 'admin') {
          router.replace('/admin')
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        toast.error(err.response?.data.error)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
    toast.success('logout successfully')
  }

  // const handleRegister = async (params, errorCallback) => {
  //   await axios
  //     .post(authConfig.registerEndpoint, params)
  //     .then(async response => {
  //       setUser(response.data.userData)
  //       if (response && response.status === 200) {
  //       }
  //       router.push('/login')
  //       window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
  //       window.localStorage.setItem('userData', JSON.stringify(response.data.userData))
  //       const returnUrl = router.query.returnUrl
  //       const redirectURL = returnUrl && returnUrl !== '/login' ? returnUrl : '/login'
  //       router.replace(redirectURL)
  //       toast.success('register successfully')
  //     })
  //     .catch(err => {
  //       if (errorCallback) errorCallback(err)
  //       toast.error('Somthing went wrong')
  //     })
  // }

  const handleResetpassword = async (params, errorCallback) => {
    await axios.put(authConfig.resetpasswordEndpoint, params)
      .then(async response => {
        if (response && response.status === 200) {
          toast.success('Change password successfully')
        }
        router.push('/login')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        toast.error(err.response.data.error)
      })
  }
  
  const handleSendMails = async (email, errorCallback) => {
    await axios
      .get(authConfig.sendMailEndpoint + '?email=' + email)
      .then(async response => {
        if (response && response.status === 200) {
          toast.success('Password link send on mail')
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        toast.error(err.response.data.message)
      })
  }

  const verify_SendMails = async (email, errorCallback) => {
    await axios
      .get(authConfig.sendMailEndpoint2 + '?email=' + email)
      .then(async response => {
        if (response && response.status === 200) {
          toast.success('Password link send on mail')
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
        toast.error(err.response.data.message)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    
    // register: handleRegister,
    mail: handleSendMails,
    successMail:verify_SendMails,
    resetpassword: handleResetpassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

