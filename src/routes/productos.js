const express = require('express');
const productos = require('../controllers/productos');
const { requireAuth, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.get('/', productos.listar);
router.get('/:id', productos.obtener);
router.post('/', requireAuth, requireAdmin, productos.crear);
router.put('/:id', requireAuth, requireAdmin, productos.actualizar);
router.delete('/:id', requireAuth, requireAdmin, productos.eliminar);

module.exports = router;
