import { Link } from 'react-router-dom'

export default function CheckoutCancel() {
  return (
    <div className="fmt-container fmt-page checkout-result">
      <h2 className="fmt-page-header">Checkout cancelled</h2>
      <p>No payment was taken. You can return to the shop and try again.</p>
      <p><Link to="/shop" className="fmt-btn">Back to Shop</Link></p>
    </div>
  )
}
