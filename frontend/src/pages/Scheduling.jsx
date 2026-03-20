import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, CheckCircle } from '../components/Icons';

const Scheduling = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data);
      } catch (err) {
        console.error('Erro ao buscar serviços');
      }
    };
    fetchServices();
  }, []);

  const categories = [...new Set(services.map(s => s.category || 'Outros'))];

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedService || !date || !time) return alert('Preencha todos os campos');

    const token = localStorage.getItem('token');
    if (!token) return alert('Você precisa estar logado para agendar');

    setLoading(true);
    try {
      const appointment_date = `${date} ${time}:00`;
      await axios.post('http://localhost:5000/api/appointments', 
        { service_id: selectedService.id, appointment_date },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao agendar');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service) => {
    if (selectedService?.id === service.id) {
      setSelectedService(null);
    } else {
      setSelectedService(service);
    }
  };

  if (success) {
    return (
      <div className="container fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <CheckCircle size={80} color="var(--primary)" />
        <h2 style={{ marginTop: '20px' }}>Agendamento Confirmado!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Enviamos os detalhes para o seu e-mail.</p>
        <button className="premium-btn" style={{ marginTop: '30px' }} onClick={() => setSuccess(false)}>Novo Agendamento</button>
      </div>
    );
  }

  return (
    <div className="container fade-in page-section" style={{ paddingBottom: '60px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontFamily: 'Playfair Display' }}>Agende sua Visita</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
        {/* Step 1: Select Service */}
        <div className="glass-card" style={{ maxHeight: '80vh', overflowY: 'auto', padding: '30px' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
            <CalendarIcon size={24} /> 1. Escolha o Serviço
          </h3>
          
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--primary)', marginBottom: '15px', borderBottom: '1px solid rgba(196, 30, 58, 0.2)', paddingBottom: '5px' }}>
                {cat.toUpperCase()}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                {services.filter(s => (s.category || 'Outros') === cat).map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => handleServiceSelect(s)}
                    style={{ 
                      display: 'flex',
                      gap: '15px',
                      padding: '12px', 
                      borderRadius: '10px', 
                      cursor: 'pointer',
                      border: selectedService?.id === s.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                      background: selectedService?.id === s.id ? 'rgba(196, 30, 58, 0.15)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: selectedService?.id === s.id ? 'scale(1.02)' : 'none'
                    }}
                  >
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={s.image || '/services/fade.png'} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{s.name}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>R$ {s.price}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Step 2: Date & Time */}
        <div className="glass-card" style={{ position: 'sticky', top: '100px', padding: '30px' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
            <Clock size={24} /> 2. Data e Horário
          </h3>
          <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>DATA</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '1rem' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>HORÁRIO</label>
              <select 
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', fontSize: '1rem' }}
              >
                <option value="">Escolha um horário...</option>
                {Array.from({ length: 24 }).map((_, h) => {
                  const hour = h < 10 ? `0${h}:00` : `${h}:00`;
                  return <option key={hour} value={hour} style={{ background: '#1a1a1a' }}>{hour}</option>;
                })}
              </select>
            </div>
            
            <div style={{ marginTop: '10px', padding: '20px', background: 'rgba(196, 30, 58, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 600, color: 'var(--primary)' }}>RESUMO DO AGENDAMENTO</p>
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '5px' }}>
                  {selectedService ? selectedService.name : 'Selecione um serviço'}
                </p>
                {date && time && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    📅 {date.split('-').reverse().join('/')} às {time}
                  </p>
                )}
                {selectedService && (
                  <p style={{ marginTop: '10px', fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>
                    TOTAL: R$ {selectedService.price}
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="premium-btn" disabled={loading} style={{ padding: '16px', fontSize: '1rem', letterSpacing: '2px' }}>
              {loading ? 'PROCESSANDO...' : 'CONFIRMAR AGENDAMENTO'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
