const pool = require('../config/db');

async function buscarPorEmail(email) {
  const { rows } = await pool.query(
    'SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  return rows[0] || null;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(
    'SELECT id, nombre, email, rol FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function crear(usuario) {
  const { nombre, email, passwordHash, rol } = usuario;
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
    [nombre, email, passwordHash, rol]
  );
  return rows[0];
}

async function actualizarCredenciales(id, passwordHash, rol) {
  const { rows } = await pool.query(
    'UPDATE usuarios SET password_hash = $1, rol = $2 WHERE id = $3 RETURNING id, nombre, email, rol',
    [passwordHash, rol, id]
  );
  return rows[0] || null;
}

module.exports = { buscarPorEmail, buscarPorId, crear, actualizarCredenciales };
