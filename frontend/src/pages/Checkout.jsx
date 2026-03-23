import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, CheckCircle } from '../components/Icons';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get('plan') || 'basic';
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const planName = plan === 'premium' ? 'Assinatura Completa' : 'Assinatura Corte';
  const planPrice = plan === 'premium' ? 'R$ 110/mês' : 'R$ 60/mês';

  const handleCheckout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Você precisa estar logado para assinar.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/subscribe', 
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage user object
      const user = JSON.parse(localStorage.getItem('user'));
      user.subscription = plan;
      localStorage.setItem('user', JSON.stringify(user));
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/subscriber-booking');
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro no pagamento');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CheckCircle size={80} color="var(--primary)" />
        <h2 style={{ marginTop: '20px' }}>Pagamento Aprovado!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Você agora é um assinante VIP {plan === 'premium' ? 'Completo' : 'Corte'}.</p>
        <p style={{ color: 'var(--text-main)', marginTop: '20px', fontSize: '0.8rem' }}>Redirecionando para a área exclusiva...</p>
      </div>
    );
  }

  return (
    <div className="container fade-in page-section" style={{ maxWidth: '500px', margin: '0 auto', paddingBottom: '60px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>Finalize sua <span style={{ color: 'var(--primary)' }}>Assinatura</span></h2>
      
      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '5px' }}>Plano Selecionado: {planName}</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>Total: {planPrice}</p>
        </div>

        <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>NÚMERO DO CARTÃO</label>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0 14px' }}>
              <CreditCard size={20} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                required
                style={{ width: '100%', padding: '14px', background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none' }} 
              />
            </div>
          </div>
          
          <div className="checkout-grid">
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>VALIDADE</label>
              <input 
                type="text" 
                placeholder="MM/AA"
                required
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '1rem' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>CVC</label>
              <input 
                type="text" 
                placeholder="123"
                required
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '1rem' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>NOME NO CARTÃO</label>
            <input 
              type="text" 
              placeholder="NOME IGUAL AO CARTÃO"
              required
              style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '1rem' }} 
            />
          </div>

          <button type="submit" className="premium-btn" disabled={loading} style={{ padding: '16px', fontSize: '1rem', letterSpacing: '2px', marginTop: '10px' }}>
            {loading ? 'PROCESSANDO...' : 'PAGAR ASSINATURA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
