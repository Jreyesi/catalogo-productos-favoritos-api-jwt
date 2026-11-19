const express = require('express');
const favoritos = require('../controllers/favoritos');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', favoritos.listar);
router.post('/', favoritos.agregar);
router.delete('/:productoId', favoritos.quitar);

module.exports = router;
