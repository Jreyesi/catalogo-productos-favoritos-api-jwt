const express = require('express');
const productos = require('../controllers/productos');

const router = express.Router();

router.get('/', productos.listar);
router.get('/:id', productos.obtener);
router.post('/', productos.crear);
router.put('/:id', productos.actualizar);
router.delete('/:id', productos.eliminar);

module.exports = router;
