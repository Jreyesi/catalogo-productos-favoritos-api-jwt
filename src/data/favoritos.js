const pool = require('../config/db');

async function listarPorUsuario(usuarioId) {
  const { rows } = await pool.query(
    `SELECT f.id AS favorito_id, p.id, p.nombre, p.descripcion, p.categoria, p.precio
     FROM favoritos f
     JOIN productos p ON p.id = f.producto_id
     WHERE f.usuario_id = $1
     ORDER BY f.id`,
    [usuarioId]
  );
  return rows;
}

async function agregar(usuarioId, productoId) {
  const { rows } = await pool.query(
    `INSERT INTO favoritos (usuario_id, producto_id) VALUES ($1, $2)
     ON CONFLICT (usuario_id, producto_id) DO NOTHING
     RETURNING id, usuario_id, producto_id`,
    [usuarioId, productoId]
  );
  return rows[0] || null;
}

async function quitar(usuarioId, productoId) {
  const { rowCount } = await pool.query(
    'DELETE FROM favoritos WHERE usuario_id = $1 AND producto_id = $2',
    [usuarioId, productoId]
  );
  return rowCount > 0;
}

module.exports = { listarPorUsuario, agregar, quitar };
