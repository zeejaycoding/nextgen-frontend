import { useEffect, useState } from 'react'
import { isFreeProduct, priceLabel } from '../data/products'
import {
  createCheckoutSession,
  createFreeOrder,
  getPaymentConfig,
} from '../lib/api'
import ProductImage from './ProductImage'

function CardIcon() {
  return (
    <svg className="payment-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6Zm2 3v2h16V9H4Zm0 5v3h5v-3H4Z" />
    </svg>
  )
}

function ApplePayIcon() {
  return (
    <span className="applepay-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.9 9.39c.98-1.52 2.5-2.41 3.94-2.41 1.47 0 2.39.79 3.6.79 1.18 0 1.9-.79 3.59-.79 1.28 0 2.64.7 3.61 1.91-3.17 1.74-2.65 5.61.07 6.61Zm-1.99-9.63c.68-.82 1.14-1.96 1.01-3.1-.98.04-2.16.65-2.86 1.48-.63.73-1.18 1.9-1.03 3.01 1.09.08 2.2-.55 2.88-1.39Z" />
      </svg>
      <span>Apple Pay</span>
    </span>
  )
}

function Checkout({ product, onBack, onDone }) {
  const free = isFreeProduct(product)
  const [paymentConfig, setPaymentConfig] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (free) return
    getPaymentConfig()
      .then(setPaymentConfig)
      .catch((configError) => setPaymentConfig({
        enabled: false,
        publishableKey: '',
        message: configError.message,
      }))
  }, [free])

  const claimFree = async () => {
    setSubmitting(true)
    setError('')
    try {
      await createFreeOrder(product.id)
      setSubmitting(false)
      onDone()
    } catch (paymentError) {
      setError(paymentError.message || 'Unable to reach the server.')
      setSubmitting(false)
    }
  }

  const startStripeCheckout = async () => {
    setSubmitting(true)
    setError('')

    try {
      if (!paymentConfig?.enabled) {
        throw new Error(paymentConfig?.message || 'Stripe payments are not configured on the server.')
      }

      const session = await createCheckoutSession({ productId: product.id })

      if (session.free) {
        await claimFree()
        return
      }

      if (!session.url) throw new Error('Stripe did not return a checkout URL. Please try again.')

      // Stripe.js removed redirectToCheckout in 2025. The server-created
      // session URL is the supported way to enter Stripe Checkout.
      window.location.assign(session.url)
    } catch (paymentError) {
      setError(paymentError.message || 'Unable to start checkout. Please try again.')
      setSubmitting(false)
    }
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
          <strong>{priceLabel(product)}</strong>
        </div>
        <div className="order-total">
          <span>Total</span>
          <strong>{priceLabel(product)}</strong>
        </div>

        {free ? (
          <div className="free-checkout">
            <p>This application is free. No payment details are needed.</p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button
              type="button"
              className="btn btn-primary checkout-submit"
              disabled={submitting}
              onClick={claimFree}
            >
              {submitting ? 'Processing…' : 'Get it free'} <span className="arrow">→</span>
            </button>
          </div>
        ) : (
          <>
            <div className="payment-switch" role="group" aria-label="Payment method">
              <button
                type="button"
                className="payment-option"
                disabled={submitting || !paymentConfig?.enabled}
                onClick={() => { setError(''); startStripeCheckout() }}
              >
                <CardIcon /> Credit card
              </button>
              <button
                type="button"
                className="payment-option"
                disabled={submitting || !paymentConfig?.enabled}
                onClick={() => { setError(''); startStripeCheckout() }}
              >
                <ApplePayIcon />
              </button>
            </div>

            <div className="secure-payment-panel">
              <p>No card details are stored by DOMIGEN.</p>
              {paymentConfig && !paymentConfig.enabled && (
                <p className="form-error" role="alert">
                  {paymentConfig.message || 'Stripe payments are not configured on the server.'}
                </p>
              )}
              {error && <p className="form-error" role="alert">{error}</p>}
            </div>
          </>
        )}

        {free && <p className="checkout-note">No payment is taken for free applications.</p>}
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
            <h2 id="checkout-title">Free application added</h2>
            <p>{product.title} has been added to your order at no cost.</p>
            <p className="success-note">No payment was taken because this application is free.</p>
            <div className="success-total">
              <span>Total</span> <strong>{priceLabel(product)}</strong>
            </div>
            <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  )
}
