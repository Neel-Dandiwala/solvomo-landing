import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BlogIndex, BlogPost } from './Blog.jsx'
import PrivacyPage from './PrivacyPage.jsx'
import SolvomoLanding from './SolvomoLanding.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolvomoLanding />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
