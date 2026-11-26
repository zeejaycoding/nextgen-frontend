import { useLocation } from 'react-router-dom'
import AccountNotice from './AccountNotice'
import Header from './Header'
import Footer from './Footer'
import ReferenceLayout from './ReferenceLayout'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const clonePage = pathname === '/'
    || pathname === '/shop'
    || pathname.startsWith('/product/')
    || pathname.startsWith('/users/')
    || pathname.startsWith('/tickets')

  return (
    <>
      <AccountNotice />
      {clonePage ? (
        <ReferenceLayout>{children}</ReferenceLayout>
      ) : (
        <div className="app-shell">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      )}
    </>
  )
}
