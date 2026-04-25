import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivacyPage from './PrivacyPage.jsx'
import SolvomoLanding from './SolvomoLanding.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolvomoLanding />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  )
}
