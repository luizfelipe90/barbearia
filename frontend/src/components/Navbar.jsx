import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TchescoLogo, LogIn, LogOut, Layout, X } from './Icons';

const MenuIcon = ({ size=28, color='currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="nav-fixed nav-scrolled" style={{ borderBottom: '4px solid transparent', borderImage: 'var(--barber-stripe) 1', padding: '15px 0' }}>
      <div className="container nav-container">
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
          <TchescoLogo size={42} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '2px', fontFamily: 'serif' }}>BARBERSHOP</span>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '5px' }}>
              <div style={{ flex: 1, height: '1px', background: 'white', opacity: 0.5 }}></div>
              <span style={{ color: 'white', fontWeight: 500, fontSize: '0.65rem', letterSpacing: '4px' }}>TCHESCO</span>
              <div style={{ flex: 1, height: '1px', background: 'white', opacity: 0.5 }}></div>
            </div>
          </div>
        </Link>
        
        <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <MenuIcon />}
        </div>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>INÍCIO</Link>
          <Link to="/scheduling" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>AGENDAR</Link>
          {user?.subscription && (
            <Link to="/subscriber-booking" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>ASSINANTES</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>
              <Layout size={18} /> PAINEL ADM
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="secondary-btn" style={{ padding: '10px 20px', fontSize: '0.8rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }}>
              <LogOut size={16} /> SAIR
            </button>
          ) : (
            <Link to="/login" className="premium-btn" style={{ padding: '10px 24px', fontSize: '0.8rem' }}>
              <LogIn size={16} /> Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
