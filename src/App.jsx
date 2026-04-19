import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar.jsx'
import LandingPage from './pages/LandingPage'
import MarketplacePage from './pages/MarketplacePage'
import AuthPage from './pages/AuthPage'
import RegisterWizard from './pages/RegisterWizard'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/registro" element={<RegisterWizard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App