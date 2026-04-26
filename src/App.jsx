import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import BencanaIklim from './pages/BencanaIklim'
import CurahHujan from './pages/CurahHujan'
import KebakararanEmisi from './pages/KebakararanEmisi'
import ProduksiPadi from './pages/ProduksiPadi'
import IKP from './pages/IKP'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bencana" element={<BencanaIklim />} />
        <Route path="/curah-hujan" element={<CurahHujan />} />
        <Route path="/kebakaran-emisi" element={<KebakararanEmisi />} />
        <Route path="/produksi-padi" element={<ProduksiPadi />} />
        <Route path="/ikp" element={<IKP />} />
      </Routes>
      <Footer />
    </>
  )
}
