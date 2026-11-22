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

  return (
    <div className="fmt-container fmt-page checkout-result">
      <h2 className="fmt-page-header">
        {state.status === 'paid'
          ? 'Payment confirmed by Stripe'
          : state.status === 'unpaid'
            ? 'Payment not completed'
            : state.status === 'loading'
              ? 'Checking Stripe'
              : 'Checkout issue'}
      </h2>

      {state.status === 'loading' && <p>Confirming this Checkout Session with Stripe…</p>}

      {state.status === 'paid' && (
        <>
          <p>
            Stripe reports your payment for <strong>{state.product}</strong> as successful.
          </p>
          <p>Amount paid: <strong>{money(state.amount, state.currency)}</strong></p>
          <p>Method: <strong>{state.method}</strong></p>
          {state.cardBrand && state.cardLast4 && (
            <p>Card: <strong>{state.cardBrand} •••• {state.cardLast4}</strong></p>
          )}
          {state.paymentIntentId && (
            <p>Stripe reference: <strong>{state.paymentIntentId}</strong></p>
          )}
          {state.recorded && (
            <p>This order is now in the admin payment record, taken from Stripe.</p>
          )}
        </>
      )}

      {state.status === 'unpaid' && (
        <>
          <p>Stripe has not confirmed a payment for this Checkout Session.</p>
          <p>
            Checkout status: <strong>{state.stripeStatus || 'not completed'}</strong>
            {' · '}Payment status: <strong>{state.paymentStatus || 'unpaid'}</strong>
          </p>
        </>
      )}

      {state.status === 'error' && <p className="form-error">{state.message}</p>}

      <p><Link to="/shop" className="fmt-btn">Back to Shop</Link></p>
    </div>
  )
}
