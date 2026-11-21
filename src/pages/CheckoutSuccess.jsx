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
    getCheckoutSession(sessionId)
      .then((data) => {
        if (!active) return
        setState({
          status: data.paid ? 'paid' : 'processing',
          product: data.product,
          amount: data.amount,
        })
      })
      .catch((error) => {
        if (active) setState({ status: 'error', message: error.message })
      })

    return () => { active = false }
  }, [sessionId, token])

  return (
    <div className="fmt-container fmt-page checkout-result">
      <h2 className="fmt-page-header">
        {state.status === 'paid' ? 'Payment confirmed' : state.status === 'processing' ? 'Payment processing' : 'Checkout issue'}
      </h2>

      {state.status === 'loading' && <p>Confirming your payment with Stripe…</p>}

      {state.status === 'paid' && (
        <>
          <p>Your payment for <strong>{state.product}</strong> was successful.</p>
          <p>Amount paid: <strong>${Number(state.amount || 0).toFixed(2)}</strong></p>
          <p>Your order has been recorded and is now visible in the admin dashboard.</p>
        </>
      )}

      {state.status === 'processing' && (
        <p>
          Your payment for <strong>{state.product}</strong> is still being confirmed.
          It will appear in your orders shortly.
        </p>
      )}

      {state.status === 'error' && <p className="form-error">{state.message}</p>}

      <p><Link to="/shop" className="fmt-btn">Back to Shop</Link></p>
    </div>
  )
}
