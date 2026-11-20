const bcrypt = require('bcryptjs');
const usuarios = require('../data/usuarios');
const { validarRegistro, validarLogin } = require('../utils/validators');
const { generarToken } = require('../utils/token');

async function registro(req, res, next) {
  try {
    const { errores, datos, status } = validarRegistro(req.body || {});
    if (errores.length) {
      return res.status(status).json({ error: 'Datos de registro inválidos', detalles: errores });
    }

    const existente = await usuarios.buscarPorEmail(datos.email);
    if (existente) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(datos.password, 10);
    const usuario = await usuarios.crear({
      nombre: datos.nombre,
      email: datos.email.toLowerCase(),
      passwordHash,
      rol: 'usuario'
    });

    res.status(201).json({ mensaje: 'Usuario registrado', usuario });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { errores, datos } = validarLogin(req.body || {});
    if (errores.length) {
      return res.status(400).json({ error: 'Credenciales inválidas', detalles: errores });
    }

    const usuario = await usuarios.buscarPorEmail(datos.email);
    if (!usuario || !(await bcrypt.compare(datos.password, usuario.password_hash))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = generarToken(usuario);
    res.status(200).json({
      token,
      tipo: 'Bearer',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { registro, login };
