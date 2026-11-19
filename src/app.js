const express = require('express');
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
