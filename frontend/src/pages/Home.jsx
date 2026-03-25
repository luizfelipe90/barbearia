import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Clock, Award, TchescoLogo } from '../components/Icons';

const Home = () => {
  return (
    <main className="reveal">
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        textAlign: 'center',
        background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/services/imagem.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        position: 'relative',
        borderBottom: '4px solid var(--primary)',
        padding: '20px'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'var(--primary)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 800, fontSize: '0.9rem' }}>SINCE 2024</p>
          <h1 className="hero-title" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            background: 'none', 
            WebkitTextFillColor: 'initial', 
            color: 'var(--primary)', 
            textTransform: 'uppercase',
            marginBottom: '30px'
          }}>
            <span style={{ fontSize: '1.1em', fontWeight: 900, letterSpacing: '12px', textShadow: '2px 2px 10px rgba(0,0,0,1)' }}>BARBERSHOP</span>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', gap: '20px', marginTop: '-5px' }}>
              <div style={{ flex: 1, height: '2px', background: 'white' }}></div>
              <span style={{ color: 'white', fontWeight: 400, fontSize: '0.35em', letterSpacing: '20px' }}>TCHESCO</span>
              <div style={{ flex: 1, height: '2px', background: 'white' }}></div>
            </div>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', maxWidth: '700px', margin: '0 auto 40px', fontWeight: 500, letterSpacing: '1px', opacity: 0.9, textShadow: '1px 1px 5px rgba(0,0,0,1)' }}>
            A excelência em barbearia clássica. Estilo, precisão e o visual que você merece.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/scheduling" className="premium-btn" style={{ marginTop: '40px', padding: '18px 45px' }}>
            RESERVAR AGORA
          </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container" style={{ padding: '120px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '60px' }}>Nossa <span style={{ color: 'var(--primary)' }}>Assinatura</span></h2>
        <div className="home-services-grid">
          {[
            { plan: 'basic', name: 'Assinatura Corte', price: 'R$ 60', desc: 'Corte 4 vezes ao mês.' },
            { plan: 'premium', name: 'Assinatura Completa', price: 'R$ 110', desc: 'Corte e barba 4 vezes ao mês.' }
          ].map((s, i) => (
            <div key={i} className="glass-panel service-card" style={{ padding: '40px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '15px' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', minHeight: '50px' }}>{s.desc}</p>
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{s.price}</span>
                <Link to={`/checkout?plan=${s.plan}`} className="premium-btn" style={{ width: '100%', padding: '12px' }}>Assinar Agora</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      <section style={{ padding: '80px 0', background: 'var(--glass)', borderRadius: '20px', marginBottom: '100px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '40px', padding: '0 40px' }}>
          <div style={{ textAlign: 'center' }}><Award size={40} color="var(--primary)" /><h4 style={{ marginTop: '10px' }}>ELITE</h4></div>
          <div style={{ textAlign: 'center' }}><ShieldCheck size={40} color="var(--primary)" /><h4 style={{ marginTop: '10px' }}>CONFIANÇA</h4></div>
          <div style={{ textAlign: 'center' }}><Clock size={40} color="var(--primary)" /><h4 style={{ marginTop: '10px' }}>PONTUAL</h4></div>
          <div style={{ textAlign: 'center' }}><Star size={40} color="var(--primary)" /><h4 style={{ marginTop: '10px' }}>PREMIUM</h4></div>
        </div>
      </section>
    </main>
  );
};

export default Home;
