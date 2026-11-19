require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../src/config/db');
const usuarios = require('../src/data/usuarios');

async function main() {
  const nombre = process.env.ADMIN_NOMBRE;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!nombre || !email || !password) {
    throw new Error('Faltan variables ADMIN_NOMBRE, ADMIN_EMAIL o ADMIN_PASSWORD en .env');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const existente = await usuarios.buscarPorEmail(email);

  if (existente) {
    await usuarios.actualizarCredenciales(existente.id, passwordHash, 'admin');
    console.log('Administrador actualizado');
  } else {
    await usuarios.crear({ nombre, email, passwordHash, rol: 'admin' });
    console.log('Administrador creado');
  }

  await pool.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
