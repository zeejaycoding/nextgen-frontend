import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { id: 'account', label: 'Account', to: '/users/account' },
  { id: 'password', label: 'Password', to: '/users/account?tab=password' },
  { id: 'ticket', label: 'Ticket', to: '/users/account?tab=ticket' },
  { id: 'notification', label: 'Notifications', to: '/users/account?tab=notification' },
]

export default function PanelShell({ active = 'account', title, subtitle, children }) {
  return (
    <>
      <section className="fmt-breadcrumb-section">
        <div className="fmt-container">
          <ul className="fmt-breadcrumb">
            <li><Link to="/">Home</Link></li>
            <li className="fmt-divider">/</li>
            <li><Link to="/users/account">Panel</Link></li>
            <li className="fmt-divider">/</li>
            <li className="fmt-active">{title}</li>
          </ul>
        </div>
      </section>

      <div className="fmt-container fmt-page fmt-panel-page">
        <div className="fmt-panel-layout">
          <aside className="fmt-panel-sidebar">
            <div className="fmt-panel-nav-header">User Panel</div>
            <ul className="fmt-panel-nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className={active === item.id ? 'active' : undefined}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </aside>

          <section className="fmt-panel-main">
            <div className="fmt-panel-title-divider">
              <h2 className="fmt-panel-title">{title}</h2>
              {subtitle ? <small className="fmt-panel-subtitle">{subtitle}</small> : null}
            </div>
            {children}
          </section>
        </div>
      </div>
    </>
  )
}
