import fs from 'fs';
import path from 'path';

const LOG_FILE = path.resolve('./debug.log');
const log = (msg) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${msg}\n`);
  console.log(msg);
};

// Pure in-memory database object
const inMemoryDB = {
  users: [],
  services: [],
  appointments: [],
  products: [],
  orders: []
};

// Seeding initial services directly into memory
inMemoryDB.services.push(
  // CATEGORIA 1: Cortes com Degradê (Fade)
  { id: 1, category: 'Fade', name: 'Mid/Low Fade', description: 'Transição suave nas laterais, do curto para o longo. Versátil e moderno.', price: 60.00, duration: 45, image: '/services/fade.png' },
  { id: 2, category: 'Fade', name: 'Taper Fade', description: 'Degradê sutil apenas nas costeletas e nuca. Elegante e discreto.', price: 55.00, duration: 40, image: '/services/fade.png' },
  { id: 3, category: 'Fade', name: 'Faux Hawk Fade', description: 'Laterais curtas com volume no topo, criando um moicano moderno.', price: 65.00, duration: 50, image: '/services/fade.png' },
  
  // CATEGORIA 2: Cortes Curtos e Clássicos
  { id: 4, category: 'Clássicos', name: 'Buzz Cut', description: 'Corte raspado uniforme. Praticidade extrema com visual marcante.', price: 40.00, duration: 30, image: '/services/classic.png' },
  { id: 5, category: 'Clássicos', name: 'Crew Cut', description: 'O clássico militar: prático, atemporal e fácil de manter.', price: 45.00, duration: 35, image: '/services/classic.png' },
  { id: 6, category: 'Clássicos', name: 'Edgar (Takuash)', description: 'Franja reta com laterais americanas. Tendência urbana moderna.', price: 50.00, duration: 45, image: '/services/classic.png' },

  // CATEGORIA 3: Cortes Médios e Compridos
  { id: 7, category: 'Modernos', name: 'Pompadour Moderno', description: 'Topete alto e volumoso. Ideal para quem busca presença e estilo.', price: 70.00, duration: 60, image: '/services/modern.png' },
  { id: 8, category: 'Modernos', name: 'Mullet Moderno', description: 'Estilo retrô repaginado, curto nas laterais e longo atrás.', price: 75.00, duration: 60, image: '/services/modern.png' },
  { id: 9, category: 'Modernos', name: 'Messy Hair', description: 'Visual bagunçado com fios médios e textura para movimento.', price: 65.00, duration: 50, image: '/services/modern.png' },

  // CATEGORIA 4: Cortes por Tipo de Cabelo
  { id: 10, category: 'Específicos', name: 'Cacheados & Crespos', description: 'Corte em camadas para valorizar a textura natural (3A-4C).', price: 65.00, duration: 60, image: '/services/curly.png' },
  { id: 11, category: 'Específicos', name: 'Liso & Ondulado', description: 'Undercut ou Slick Back adaptado para fios lisos ou com ondas.', price: 60.00, duration: 50, image: '/services/curly.png' },

  // EXTRAS
  { id: 12, category: 'Barba', name: 'Barba Imperial', description: 'Toalha quente e óleos essenciais para uma barba de mestre.', price: 45.00, duration: 30, image: '/services/beard.png' },
  { id: 13, category: 'Barba', name: 'Combo Signature', description: 'Corte + Barba + Sobrancelha. O tratamento de elite completo.', price: 95.00, duration: 90, image: '/services/signature.png' }
);

// Pre-seeding an admin user (Pass: 123456)
inMemoryDB.users.push({
  id: 999,
  name: 'Administrador',
  email: 'adm@admin.com',
  password: '$2b$10$PRZjO86hlGaieqNdV6xHF.ExZohRvB17em9au6OQpQ4kNCr9aUiTC',
  role: 'admin'
});

const db = {
  query: async (sql, params) => {
    log(`[QUERY] ${sql} | Params: ${JSON.stringify(params)}`);
    if (sql.includes('INSERT')) {
      return db.execute(sql, params);
    }
    if (sql.includes('SELECT * FROM users WHERE email = ?')) {
      const match = inMemoryDB.users.filter(u => u.email == params[0]);
      log(`[QUERY] Found ${match.length} users`);
      return [match];
    }
    if (sql.includes('SELECT * FROM services')) {
      return [inMemoryDB.services];
    }
    if (sql.includes('SELECT a.*')) {
      const filtered = inMemoryDB.appointments.filter(a => {
        const matches = (a.user_id == params[0] || params[1] == 'admin');
        return matches;
      });
      log(`[QUERY] Appointments total: ${inMemoryDB.appointments.length} | Filtered: ${filtered.length} for user ${params[0]}`);
      if (inMemoryDB.appointments.length > 0) {
        log(`[DEBUG] First appointment user_id: ${inMemoryDB.appointments[0].user_id} (type: ${typeof inMemoryDB.appointments[0].user_id})`);
        log(`[DEBUG] Looking for user_id: ${params[0]} (type: ${typeof params[0]})`);
      }
      return [filtered];
    }
    if (sql.includes('SELECT * FROM products')) {
      return [inMemoryDB.products];
    }
    if (sql.includes('SELECT * FROM appointments WHERE appointment_date = ?')) {
      return [inMemoryDB.appointments.filter(a => a.appointment_date == params[0] && a.status != 'cancelled')];
    }
    return [[]];
  },
  execute: async (sql, params) => {
    log(`[EXECUTE] ${sql} | Params: ${JSON.stringify(params)}`);
    if (sql.includes('INSERT INTO users')) {
      const newUser = { id: Date.now(), name: params[0], email: params[1], password: params[2], role: 'customer' };
      inMemoryDB.users.push(newUser);
      log(`[EXECUTE] User registered: ${newUser.id} | Total: ${inMemoryDB.users.length}`);
      return [{ insertId: newUser.id }];
    }
    if (sql.includes('INSERT INTO services')) {
      const s = { id: Date.now(), name: params[0], description: params[1], price: params[2], duration: params[3] };
      inMemoryDB.services.push(s);
      return [{ insertId: s.id }];
    }
    if (sql.includes('INSERT INTO appointments')) {
      const a = { 
        id: Date.now(), 
        user_id: params[0], 
        service_id: params[1], 
        appointment_date: params[2], 
        status: 'pending',
        service_name: inMemoryDB.services.find(s => s.id == params[1])?.name || 'Serviço'
      };
      inMemoryDB.appointments.push(a);
      log(`[EXECUTE] Appointment created: ${a.id} for user ${a.user_id} | Total: ${inMemoryDB.appointments.length}`);
      return [{ insertId: a.id }];
    }
    return [{ insertId: 0 }];
  },
  release: () => {},
  getConnection: async () => ({
    query: async () => {},
    release: () => {}
  })
};

export default db;
