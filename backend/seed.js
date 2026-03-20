import db from './config/db.js';

const seedServices = async () => {
  try {
    const services = [
      { name: 'Corte Moderno', description: 'Corte atualizado seguindo as tendências mundiais.', price: 60.00, duration: 45 },
      { name: 'Barba Imperial', description: 'Tratamento completo com toalha quente e óleos essenciais.', price: 45.00, duration: 30 },
      { name: 'Combo Signature', description: 'Corte + Barba + Sobrancelha. O tratamento de elite.', price: 95.00, duration: 80 },
      { name: 'Limpeza de Pele', description: 'Remoção de impurezas e hidratação profunda.', price: 70.00, duration: 40 }     
    ];

    for (const service of services) {
      await db.execute(
        'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
        [service.name, service.description, service.price, service.duration]
      );
    }
    console.log('✅ Services seeded successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding services:', error.message);
    process.exit(1);
  }
};

seedServices();
