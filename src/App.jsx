import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/NavBar.jsx'
import LandingPage from './pages/LandingPage'
import MarketplacePage from './pages/MarketplacePage'
import AuthPage from './pages/AuthPage'
import RegisterWizard from './pages/RegisterWizard'
import DashboardVendedor from './pages/DashboardVendedor'
import AdminDashboard from './pages/AdminDashboard'
import TiendaDetalle from './pages/TiendaDetalle'
import ProductoDetalle from './pages/ProductoDetalle'
import MisComprasPage from './pages/MisComprasPage'
import SeguimientoPedidoPage from './pages/SeguimientoPedidoPage'
import Beneficios from './pages/Beneficios';
import Contacto from './pages/Contacto';
import Footer from './components/Footer.jsx'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/tienda/:slug" element={<TiendaDetalle />} />
            <Route path="/tienda/:slug/producto/:id" element={<ProductoDetalle />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/registro" element={<RegisterWizard />} />
            <Route path="/dashboard" element={<DashboardVendedor />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/mis-compras" element={<MisComprasPage />} />
            <Route path="/seguimiento" element={<SeguimientoPedidoPage />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/beneficios" element={<Beneficios />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App