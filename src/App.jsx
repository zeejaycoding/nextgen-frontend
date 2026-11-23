import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useAutoUpdate } from './lib/useAutoUpdate'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'
import NotFound from './pages/NotFound'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.querySelector(hash)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export default function App() {
  useAutoUpdate()

  return (
    <>
      <ScrollManager />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  )
}
