import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TchescoLogo, LogIn, LogOut, Layout } from './Icons';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [location]); // Re-run when route changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="nav-fixed nav-scrolled" style={{ borderBottom: '4px solid transparent', borderImage: 'var(--barber-stripe) 1', padding: '15px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>INÍCIO</Link>
          <Link to="/scheduling" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>AGENDAR</Link>
          <Link to="/store" style={{ textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>DELIVERY</Link>
          
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
