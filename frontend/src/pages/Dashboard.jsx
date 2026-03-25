import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Calendar, DollarSign, UserPlus, X } from '../components/Icons';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showBarberModal, setShowBarberModal] = useState(false);
  const [barberData, setBarberData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin' && user.role !== 'barber') return;
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const appRes = await axios.get('http://localhost:5000/api/appointments', { headers: { Authorization: `Bearer ${token}` } });
        setAppointments(appRes.data);
      } catch (err) {
        console.error('Erro ao buscar agendamentos');
      }

      try {
        const orderRes = await axios.get('http://localhost:5000/api/products/orders', { headers: { Authorization: `Bearer ${token}` } });
        setOrders(orderRes.data);
      } catch (err) {
        console.error('Erro ao buscar pedidos');
      }
    };
    fetchData();
  }, [user.role]);

  const handleRegisterBarber = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', { ...barberData, role: 'barber' });
      alert('Barbeiro cadastrado com sucesso!');
      setShowBarberModal(false);
      setBarberData({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao cadastrar barbeiro');
    } finally {
      setLoading(false);
    }
  };

  if (user.role !== 'admin' && user.role !== 'barber') {
    return (
      <div className="container page-section" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: 'var(--primary)' }}>Acesso Restrito</h2>
        <p style={{ marginTop: '20px' }}>Este painel é exclusivo para profissionais do Mustache Club.</p>
      </div>
    );
  }

  return (
    <div className="container fade-in page-section" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem' }}>Painel Barbeiro <span style={{ color: 'var(--primary)' }}>{user.name}</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Monitoramento dos atendimentos e gestão da equipe.</p>
        </div>
        {user.role === 'admin' && (
          <button className="premium-btn" onClick={() => setShowBarberModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={20} /> Cadastrar Barbeiro
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {/* Appointments History */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="var(--primary)" /> Meus Agendamentos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {appointments.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Nenhum agendamento encontrado.</p> : appointments.map(a => (
              <div key={a.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.service_name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>Cliente: <span style={{ color: 'var(--primary)' }}>{a.user_name}</span></div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                    {new Date(a.appointment_date).toLocaleDateString()}<br/>
                    {new Date(a.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ marginTop: '5px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>{a.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders History (Only for Admins) */}
        {user.role === 'admin' && (
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={20} color="var(--primary)" /> Pedidos da Loja
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Nenhum pedido realizado.</p> : orders.map(o => (
                <div key={o.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Pedido #{o.id}</span>
                    <span style={{ fontWeight: 700 }}>R$ {o.total_price}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>Status: {o.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary (Only for Admins) */}
        {user.role === 'admin' && (
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={20} color="var(--primary)" /> Resumo Geral
            </h3>
            <div style={{ padding: '20px', background: 'var(--primary)', color: 'var(--secondary)', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Faturamento Total (Est.)</p>
              <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>R$ { (appointments.length * 60 + orders.reduce((a, b) => a + parseFloat(b.total_price), 0)).toFixed(2) }</h2>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Basado em todos os atendimentos e vendas da loja.
            </p>
          </div>
        )}
      </div>

      {/* Barber Registration Modal */}
      {showBarberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowBarberModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <UserPlus size={24} /> Novo Barbeiro
            </h3>
            <form onSubmit={handleRegisterBarber} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>NOME COMPLETO</label>
                <input type="text" value={barberData.name} onChange={e => setBarberData({...barberData, name: e.target.value})} placeholder="Ex: Marcos Silva" required />
              </div>
              <div className="input-group">
                <label>E-MAIL PROFISSIONAL</label>
                <input type="email" value={barberData.email} onChange={e => setBarberData({...barberData, email: e.target.value})} placeholder="marcos@mustache.club" required />
              </div>
              <div className="input-group">
                <label>SENHA DE ACESSO</label>
                <input type="password" value={barberData.password} onChange={e => setBarberData({...barberData, password: e.target.value})} placeholder="••••••••" required />
              </div>
              <button type="submit" className="premium-btn" disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? 'CADASTRANDO...' : 'CONFIRMAR CADASTRO'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
