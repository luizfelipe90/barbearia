import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, CheckCircle, User } from '../components/Icons';

const Scheduling = () => {
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [date, setDate] = useState(() => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffset).toISOString().split('T')[0];
  });
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, barberRes] = await Promise.all([
          axios.get('http://localhost:5000/api/services'),
          axios.get('http://localhost:5000/api/auth/barbers')
        ]);
        setServices(serviceRes.data);
        setBarbers(barberRes.data);
      } catch (err) {
        console.error('Erro ao buscar dados');
      }
    };
    fetchData();
  }, []);

  const categories = [...new Set(services.map(s => s.category || 'Outros'))];

  const generateTimes = () => {
    const times = [];
    for (let h = 9; h <= 18; h++) {
      for (let m = 0; m < 60; m += 15) {
        if (h === 18 && m > 0) break;
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        times.push(`${hh}:${mm}`);
      }
    }
    return times;
  };

  const availableTimes = generateTimes();

  const nextDays = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedService || !date || !time || !selectedBarber) return alert('Preencha todos os campos, incluindo o barbeiro');

    const token = localStorage.getItem('token');
    if (!token) return alert('Você precisa estar logado para agendar');

    setLoading(true);
    try {
      const appointment_date = `${date} ${time}:00`;
      await axios.post('http://localhost:5000/api/appointments', 
        { service_id: selectedService.id, appointment_date, barber_id: selectedBarber.id },
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
      
      <div className="booking-grid">
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
                    className={`service-card ${selectedService?.id === s.id ? 'active' : ''}`}
                    style={{ 
                      display: 'flex',
                      gap: '15px',
                      padding: '12px', 
                      borderRadius: '10px', 
                      border: selectedService?.id === s.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                      background: selectedService?.id === s.id ? 'rgba(196, 30, 58, 0.15)' : 'rgba(255,255,255,0.02)',
                    }}>
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

          {/* New Step 3: Choose Barber */}
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
              <User size={24} /> 2. Escolha o Barbeiro
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
              {barbers.map(barber => (
                <div 
                  key={barber.id}
                  className={`glass-card service-card ${selectedBarber?.id === barber.id ? 'active' : ''}`}
                  onClick={() => setSelectedBarber(barber)}
                  style={{
                    padding: '15px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10px', border: '2px solid var(--primary)' }}>
                    <img src={barber.image || '/services/imagem.jpg'} alt={barber.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{barber.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Date & Time */}
        <div className="glass-card" style={{ position: 'sticky', top: '100px', padding: '30px' }}>
          <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
            <Clock size={24} /> 3. Data e Horário
          </h3>
          <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>DATA</label>
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'thin' }}>
                {nextDays.map((d) => {
                  const tzOffset = d.getTimezoneOffset() * 60000;
                  const fulldate = new Date(d.getTime() - tzOffset).toISOString().split('T')[0];
                  const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
                  const dayNum = d.getDate();
                  const isSelected = date === fulldate;
                  return (
                    <div 
                      key={fulldate}
                      className={`slot-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setDate(fulldate)}
                      style={{
                        flex: '0 0 auto',
                        width: '70px',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                        transform: isSelected ? 'scale(1.05)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isSelected ? 'white' : 'var(--text-muted)' }}>{dayName}</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: isSelected ? 'white' : 'var(--text-main)', marginTop: '2px' }}>{dayNum}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>HORÁRIOS DISPONÍVEIS</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))', gap: '10px', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                {availableTimes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`slot-item ${time === t ? 'active' : ''}`}
                    onClick={() => setTime(t)}
                    style={{
                      padding: '10px 0',
                      borderRadius: '6px',
                      border: time === t ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: time === t ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: time === t ? 'white' : 'var(--text-main)',
                      fontWeight: time === t ? 800 : 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {!time && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Selecione um horário na grade acima.</p>}
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
