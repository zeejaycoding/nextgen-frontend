import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import Splash from './components/Splash'
import { MemberProvider } from './context/MemberContext'
import { ProductsProvider } from './context/ProductsContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import './index.css'
import './reference.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteSettingsProvider>
      <Splash />
      <MemberProvider>
        <ProductsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ProductsProvider>
      </MemberProvider>
    </SiteSettingsProvider>
  </React.StrictMode>,
)
