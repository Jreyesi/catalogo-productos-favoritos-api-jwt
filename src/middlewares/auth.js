const jwt = require('jsonwebtoken');
const usuarios = require('../data/usuarios');

function requireAuth(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const partes = cabecera.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer' || !partes[1]) {
    return res.status(401).json({ error: 'Se requiere un token Bearer' });
  }

  try {
    const payload = jwt.verify(partes[1], process.env.JWT_SECRET);
    req.usuario = { id: payload.id, rol: payload.rol };
    next();
  } catch (error) {
    const mensaje = error.name === 'TokenExpiredError'
      ? 'El token ha expirado'
      : 'Token inválido';
    return res.status(401).json({ error: mensaje });
  }
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.usuario) {
      return res.status(403).json({ error: 'Se requiere rol de administrador' });
    }
    const usuario = await usuarios.buscarPorId(req.usuario.id);
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Se requiere rol de administrador' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAuth, requireAdmin };
