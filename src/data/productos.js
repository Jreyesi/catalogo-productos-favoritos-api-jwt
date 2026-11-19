const pool = require('../config/db');

const CAMPOS = 'id, nombre, descripcion, categoria, precio';

async function listar(categoria) {
  const valores = [];
  let sql = `SELECT ${CAMPOS} FROM productos`;
  if (categoria) {
    valores.push(categoria);
    sql += ' WHERE LOWER(categoria) = LOWER($1)';
  }
  sql += ' ORDER BY id';
  const { rows } = await pool.query(sql, valores);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${CAMPOS} FROM productos WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function crear(producto) {
  const { nombre, descripcion, categoria, precio } = producto;
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, descripcion, categoria, precio) VALUES ($1, $2, $3, $4) RETURNING ${CAMPOS}`,
    [nombre, descripcion, categoria, precio]
  );
  return rows[0];
}

async function actualizar(id, producto) {
  const { nombre, descripcion, categoria, precio } = producto;
  const { rows } = await pool.query(
    `UPDATE productos SET nombre = $1, descripcion = $2, categoria = $3, precio = $4 WHERE id = $5 RETURNING ${CAMPOS}`,
    [nombre, descripcion, categoria, precio, id]
  );
  return rows[0] || null;
}

async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };
