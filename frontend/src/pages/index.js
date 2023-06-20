
// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'
import jwt_decode from "jwt-decode";

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

export const getHomeRoute = role => {
  if (role === 'basic') return '/basic'
  else if (role === 'admin') return '/admin'
  else if (role === 'carniqUser') return '/dashboard'

}

const Home = () => {

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }


    if (auth.user) {
      let role = auth?.user?.role
      if (typeof auth.user === 'string') {
        const user = JSON.parse(auth?.user)
        role = user?.role
      }
      const homeRoute = getHomeRoute(role)

      // Redirect user to Home URL
      router.replace(homeRoute)
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default Home
