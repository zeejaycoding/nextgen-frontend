import { Link } from 'react-router-dom'
import TicketPanel from '../components/TicketPanel'

export default function MyTickets() {
  return (
    <>
      <section className="fmt-breadcrumb-section">
        <div className="fmt-container">
          <ul className="fmt-breadcrumb">
            <li><Link to="/">Home</Link></li>
            <li className="fmt-divider">/</li>
            <li><Link to="/users/account">My Account</Link></li>
            <li className="fmt-divider">/</li>
            <li className="fmt-active">My Tickets</li>
          </ul>
        </div>
      </section>

      <div className="fmt-container fmt-page">
        <h2 className="fmt-page-header">My Tickets</h2>
        <TicketPanel />
      </div>
    </>
  )
}
