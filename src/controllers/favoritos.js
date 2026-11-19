const favoritos = require('../data/favoritos');
const productos = require('../data/productos');
const { esIdValido } = require('../utils/validators');

async function listar(req, res, next) {
  try {
    const items = await favoritos.listarPorUsuario(req.usuario.id);
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
}

async function agregar(req, res, next) {
  try {
    const productoId = req.body ? req.body.productoId : undefined;
    if (!esIdValido(productoId)) {
      return res.status(400).json({ error: 'productoId debe ser un entero positivo' });
    }

    const producto = await productos.buscarPorId(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const favorito = await favoritos.agregar(req.usuario.id, productoId);
    if (!favorito) {
      return res.status(409).json({ error: 'El producto ya está en favoritos' });
    }

    res.status(201).json({ id: favorito.id, producto });
  } catch (error) {
    next(error);
  }
}

async function quitar(req, res, next) {
  try {
    const productoId = req.params.productoId;
    if (!esIdValido(productoId)) {
      return res.status(400).json({ error: 'productoId debe ser un entero positivo' });
    }

    const eliminado = await favoritos.quitar(req.usuario.id, productoId);
    if (!eliminado) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, agregar, quitar };
