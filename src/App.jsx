import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AboutPage from './AboutPage.jsx'
import { BlogIndex, BlogPost } from './Blog.jsx'
import PricingPage from './PricingPage.jsx'
import PrivacyPage from './PrivacyPage.jsx'
import SolvomoLanding from './SolvomoLanding.jsx'

function ContactRedirect() {
  useEffect(() => {
    window.location.replace('/#contact')
  }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolvomoLanding />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactRedirect />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
