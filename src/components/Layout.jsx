import { useLocation } from 'react-router-dom'
import AccountNotice from './AccountNotice'
import BackendNotice from './BackendNotice'
import Header from './Header'
import Footer from './Footer'
import ReferenceLayout from './ReferenceLayout'

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const clonePage = pathname === '/' || pathname === '/shop' || pathname.startsWith('/product/')

  return (
    <>
      <AccountNotice />
      <BackendNotice />
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
