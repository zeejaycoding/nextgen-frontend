import { useEffect, useState } from 'react'
import { formatPrice } from '../data/products'
import ProductImage from './ProductImage'

function CardIcon() {
  return (
    <svg className="payment-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2 3v2h16V9H4Zm0 5v3h5v-3H4Z" />
    </svg>
  )
}

function PayPalIcon() {
  return (
    <span className="paypal-mark" aria-hidden="true">
      <span>Pay</span>Pal
    </span>
  )
}

function Checkout({ product, onBack, onDone }) {
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' })
  const [error, setError] = useState('')

  const update = (field) => (event) => {
    setCard((current) => ({ ...current, [field]: event.target.value }))
    setError('')
  }

  const handleCardSubmit = (event) => {
    event.preventDefault()
    const digits = card.number.replace(/\s/g, '')

    if (!card.name.trim()) return setError('Enter the name on the card.')
    if (!/^\d{13,19}$/.test(digits)) return setError('Enter a valid card number.')
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return setError('Use MM/YY for expiry.')
    if (!/^\d{3,4}$/.test(card.cvc)) return setError('Enter a valid CVC.')

    setError('')
    onDone()
  }

  return (
    <>
      <div className="modal-media">
        <ProductImage product={product} />
        <span className="checkout-media-label">Your order</span>
      </div>

      <div className="modal-body checkout-body">
        <div className="checkout-head">
          <button type="button" className="back-button" onClick={onBack}>← Back</button>
          <h2>Checkout</h2>
        </div>

        <div className="order-line">
          <span>{product.title}</span>
          <strong>{formatPrice(product.price)}</strong>
        </div>
        <div className="order-total">
          <span>Total</span>
          <strong>{formatPrice(product.price)}</strong>
        </div>

        <div className="payment-switch" role="group" aria-label="Payment method">
          <button
            type="button"
            className={`payment-option${method === 'card' ? ' is-active' : ''}`}
            onClick={() => { setMethod('card'); setError('') }}
          >
            <CardIcon /> Credit card
          </button>
          <button
            type="button"
            className={`payment-option${method === 'paypal' ? ' is-active' : ''}`}
            onClick={() => { setMethod('paypal'); setError('') }}
          >
            <PayPalIcon />
          </button>
        </div>

        {method === 'card' ? (
          <form className="checkout-form" onSubmit={handleCardSubmit} noValidate>
            <label className="field">
              <span>Cardholder name</span>
              <input
                type="text"
                value={card.name}
                onChange={update('name')}
                placeholder="Name on card"
                autoComplete="cc-name"
              />
            </label>
            <label className="field">
              <span>Card number</span>
              <input
                type="text"
                inputMode="numeric"
                maxLength={23}
                value={card.number}
                onChange={update('number')}
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
              />
            </label>
            <div className="checkout-row">
              <label className="field">
                <span>Expiry</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={card.expiry}
                  onChange={update('expiry')}
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                />
              </label>
              <label className="field">
                <span>CVC</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={card.cvc}
                  onChange={update('cvc')}
                  placeholder="123"
                  autoComplete="cc-csc"
                />
              </label>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button type="submit" className="btn btn-primary checkout-submit">
              Pay {formatPrice(product.price)} <span className="arrow">→</span>
            </button>
          </form>
        ) : (
          <div className="paypal-panel">
            <PayPalIcon />
            <p>You’ll be sent to PayPal to approve this payment.</p>
            <button type="button" className="btn btn-paypal checkout-submit" onClick={onDone}>
              Continue with PayPal
            </button>
          </div>
        )}

        <p className="checkout-note">Sandbox checkout — no real payment is taken.</p>
      </div>
    </>
  )
}

export default function CheckoutModal({ product, onClose }) {
  const [step, setStep] = useState('checkout')

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.classList.add('modal-open')

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className={`product-modal${step === 'success' ? ' product-modal--success' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>

        {step === 'checkout' && (
          <Checkout product={product} onBack={onClose} onDone={() => setStep('success')} />
        )}

        {step === 'success' && (
          <div className="checkout-success">
            <div className="success-icon" aria-hidden="true">✓</div>
            <h2 id="checkout-title">Order confirmed</h2>
            <p>
              {product.title} has been added to your order. This is a sandbox checkout, so no
              payment was processed.
            </p>
            <div className="success-total">
              <span>Total</span> <strong>{formatPrice(product.price)}</strong>
            </div>
            <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
