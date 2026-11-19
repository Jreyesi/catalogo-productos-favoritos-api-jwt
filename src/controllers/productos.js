const productos = require('../data/productos');
const { esIdValido, validarProducto } = require('../utils/validators');

async function listar(req, res, next) {
  try {
    const categoria = typeof req.query.categoria === 'string' ? req.query.categoria.trim() : undefined;
    const items = await productos.listar(categoria);
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
}

async function obtener(req, res, next) {
  try {
    if (!esIdValido(req.params.id)) {
      return res.status(400).json({ error: 'El identificador debe ser un entero positivo' });
    }
    const producto = await productos.buscarPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const { errores, datos, status } = validarProducto(req.body || {});
    if (errores.length) {
      return res.status(status).json({ error: 'Datos del producto inválidos', detalles: errores });
    }
    const producto = await productos.crear(datos);
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    if (!esIdValido(req.params.id)) {
      return res.status(400).json({ error: 'El identificador debe ser un entero positivo' });
    }
    const { errores, datos, status } = validarProducto(req.body || {});
    if (errores.length) {
      return res.status(status).json({ error: 'Datos del producto inválidos', detalles: errores });
    }
    const producto = await productos.actualizar(req.params.id, datos);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    if (!esIdValido(req.params.id)) {
      return res.status(400).json({ error: 'El identificador debe ser un entero positivo' });
    }
    const eliminado = await productos.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
