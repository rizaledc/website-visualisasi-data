import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/bencana', label: 'Bencana Iklim' },
  { to: '/curah-hujan', label: 'Curah Hujan' },
  { to: '/kebakaran-emisi', label: 'Kebakaran & Emisi' },
  { to: '/produksi-padi', label: 'Produksi Padi' },
  { to: '/ikp', label: 'IKP' },
]

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#0D0D0D',
        borderBottom: '1px solid rgba(244, 121, 32, 0.3)',
        backdropFilter: 'blur(8px)',
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(244, 121, 32, 0.08)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <NavLink to="/">
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#F47920',
              letterSpacing: '-0.02em',
            }}
          >
            Satria Data 2026
          </span>
        </NavLink>

        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            listStyle: 'none',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.exact}
                style={({ isActive }) => ({
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#F47920' : '#CCCCCC',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  transition: 'color 0.2s ease, background 0.2s ease',
                  textDecoration: isActive ? 'underline' : 'none',
                  textDecorationColor: '#F47920',
                  textUnderlineOffset: '4px',
                  display: 'block',
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = '#F47920'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.style.textDecoration.includes('underline solid')) {
                    e.currentTarget.style.color = ''
                  }
                }}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            color: '#F47920',
            padding: '8px',
            borderRadius: '6px',
          }}
          className="hamburger-btn"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              overflow: 'hidden',
              borderTop: '1px solid rgba(244, 121, 32, 0.15)',
              backgroundColor: '#0D0D0D',
            }}
          >
            <ul
              style={{
                listStyle: 'none',
                padding: '12px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.exact}
                    style={({ isActive }) => ({
                      fontSize: '15px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#F47920' : '#CCCCCC',
                      padding: '10px 0',
                      display: 'block',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      textDecoration: 'none',
                    })}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
