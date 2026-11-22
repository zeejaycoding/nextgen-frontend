import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMember } from '../context/MemberContext'
import { getCheckoutSession } from '../lib/api'

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const { token } = useMember()
  const sessionId = params.get('session_id') || ''
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    if (!sessionId || !token) {
      setState({ status: 'error', message: 'Missing checkout session. Please contact support.' })
      return
    }

    let active = true
    let timer

    // Stripe normally confirms a card payment before this redirect finishes.
    // These retries only re-read Stripe; no local success state is invented.
    const confirm = async (attempt = 0) => {
      try {
        const data = await getCheckoutSession(sessionId)
        if (!active) return

        if (data.paid || attempt >= 8) {
          setState({
            ...data,
            status: data.paid ? 'paid' : 'unpaid',
          })
          return
        }

        timer = setTimeout(() => confirm(attempt + 1), 1000)
      } catch (error) {
        if (active) setState({ status: 'error', message: error.message })
      }
    }

    confirm()

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [sessionId, token])

  const money = (amount, currency) => `${currency || 'USD'} ${Number(amount || 0).toFixed(2)}`
  const label = (value) => String(value || '').replace(/^./, (char) => char.toUpperCase())

  const heading = {
    paid: 'Payment confirmed by Stripe',
    unpaid: 'Payment not completed',
    loading: 'Checking Stripe',
    error: 'Checkout issue',
  }[state.status] || 'Checkout issue'

  return (
    <div className="fmt-container fmt-page checkout-result">
      <div className={`checkout-result-card checkout-result-card--${state.status}`}>
        <div className="checkout-result-icon" aria-hidden="true">
          {state.status === 'paid' ? '✓' : state.status === 'loading' ? '…' : '!'}
        </div>

        <p className="checkout-result-kicker">DOMIGEN secure checkout</p>
        <h2 className="checkout-result-title">{heading}</h2>

        {state.status === 'loading' && (
          <p className="checkout-result-message">Confirming this Checkout Session with Stripe…</p>
        )}

        {state.status === 'paid' && (
          <>
            <p className="checkout-result-message">
              Stripe reports your payment for <strong>{state.product}</strong> as successful.
            </p>

            <div className="receipt-card">
              <div className="receipt-amount">
                <span>Amount paid</span>
                <strong>{money(state.amount, state.currency)}</strong>
              </div>
              <div className="receipt-rows">
                <div className="receipt-row">
                  <span>Method</span>
                  <strong>{state.method}</strong>
                </div>
                {state.cardBrand && state.cardLast4 && (
                  <div className="receipt-row">
                    <span>Card</span>
                    <strong>{label(state.cardBrand)} •••• {state.cardLast4}</strong>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {state.status === 'unpaid' && (
          <>
            <p className="checkout-result-message">
              Stripe has not confirmed a payment for this Checkout Session.
            </p>
            <div className="receipt-card receipt-card--plain">
              <div className="receipt-row">
                <span>Checkout status</span>
                <strong>{state.stripeStatus || 'not completed'}</strong>
              </div>
              <div className="receipt-row">
                <span>Payment status</span>
                <strong>{state.paymentStatus || 'unpaid'}</strong>
              </div>
            </div>
          </>
        )}

        {state.status === 'error' && (
          <p className="checkout-result-message checkout-result-error">{state.message}</p>
        )}

        <Link to="/shop" className="fmt-btn">Back to Shop</Link>
      </div>
    </div>
  )
}
