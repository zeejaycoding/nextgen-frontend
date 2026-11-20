import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ReferenceLayout from './ReferenceLayout'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const clonePage = pathname === '/' || pathname === '/shop' || pathname.startsWith('/product/')

  if (clonePage) {
    return <ReferenceLayout>{children}</ReferenceLayout>
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  )
}
