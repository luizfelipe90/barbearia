import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Calendar, DollarSign } from '../components/Icons';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.role !== 'admin') return;
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
  }, []);

  if (user.role !== 'admin') {
    return (
      <div className="container page-section" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: 'var(--primary)' }}>Acesso Restrito</h2>
        <p style={{ marginTop: '20px' }}>Este painel é exclusivo para administradores do Mustache Club.</p>
      </div>
    );
  }

  return (
    <div className="container fade-in page-section" style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Painel do <span style={{ color: 'var(--primary)' }}>Administrador</span></h2>
        <p style={{ color: 'var(--text-muted)' }}>Monitoramento global dos atendimentos do Clube.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {/* Appointments History */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="var(--primary)" /> Todos os Agendamentos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {appointments.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Nenhum agendamento encontrado.</p> : appointments.map(a => (
              <div key={a.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ fontWeight: 600 }}>{a.service_name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(a.appointment_date).toLocaleString()}</div>
                <div style={{ marginTop: '5px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)' }}>{a.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders History */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={20} color="var(--primary)" /> Meus Pedidos
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

        {/* Financial Summary (Simulated) */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <DollarSign size={20} color="var(--primary)" /> Resumo Financeiro
          </h3>
          <div style={{ padding: '20px', background: 'var(--primary)', color: 'var(--secondary)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total Investido em Estilo</p>
            <h2 style={{ fontSize: '2.5rem', marginTop: '10px' }}>R$ { (appointments.length * 60 + orders.reduce((a, b) => a + parseFloat(b.total_price), 0)).toFixed(2) }</h2>
          </div>
          <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Dados baseados em seus atendimentos e compras.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
