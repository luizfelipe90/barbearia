import db from '../config/db.js';

export const getAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(`
      SELECT a.*, s.name as service_name, u.name as user_name 
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = ? OR ? = 'admin'
    `, [req.user.id, req.user.role]);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar agendamentos', error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  const { service_id, appointment_date } = req.body;
  const user_id = req.user.id;

  try {
    // Basic conflict check: same date and time
    const [conflicts] = await db.query(
      'SELECT * FROM appointments WHERE appointment_date = ? AND status != "cancelled"',
      [appointment_date]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'Horário já reservado. Por favor, escolha outro.' });
    }

    const [result] = await db.query(
      'INSERT INTO appointments (user_id, service_id, appointment_date) VALUES (?, ?, ?)',
      [user_id, service_id, appointment_date]
    );

    res.status(201).json({ message: 'Agendamento realizado com sucesso', appointmentId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao agendar', error: error.message });
  }
};
