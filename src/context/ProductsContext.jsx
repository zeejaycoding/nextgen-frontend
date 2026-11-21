import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BACKEND_ERROR_EVENT, apiFetch, createSocket } from '../lib/api'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let active = true

    apiFetch('/bootstrap')
      .then((data) => {
        if (active && Array.isArray(data?.products)) setProducts(data.products)
      })
      .catch(() => {
        /* No local fallback: show an empty catalogue and let the notice explain why. */
        if (active) setProducts([])
      })

    const socket = createSocket()
    socket.on('connect_error', () => {
      window.dispatchEvent(new CustomEvent(BACKEND_ERROR_EVENT, {
        detail: { message: 'Real-time updates are unavailable. Changes may not appear until you refresh.' },
      }))
    })
    socket.on('products', (next) => {
      if (Array.isArray(next)) setProducts(next)
    })
    socket.connect()

    return () => {
      active = false
      socket.disconnect()
    }
  }, [])

  const value = useMemo(() => {
    const bySales = (a, b) => {
      const difference = Number(b.sold || 0) - Number(a.sold || 0)
      if (difference) return difference
      return String(b.publishedAt || b.published || '').localeCompare(
        String(a.publishedAt || a.published || ''),
      )
    }

    const flagged = products.filter((product) => (
      product.featured
      || ['Featured', 'Bestseller'].includes(product.badge)
      || Number(product.sold) > 0
    ))

    // Dealers can mark products as Bestseller; otherwise real checkout counts
    // decide. If nothing has sold yet, still show the catalogue so the section
    // is useful instead of empty.
    const ranked = (flagged.length ? flagged : products).slice().sort(bySales)

    return {
      products,
      mostSold: ranked,
      findProduct: (key) => products.find((item) => String(item.slug || item.id) === String(key)),
    }
  }, [products])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error('useProducts must be used inside ProductsProvider')
  return context
}
