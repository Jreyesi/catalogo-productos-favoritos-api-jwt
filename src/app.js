const express = require('express');
const fs = require('fs');
const path = require('path');
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const favoritosRoutes = require('./routes/favoritos');

const app = express();
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

app.use(express.json());
app.use(express.static(frontendDist));
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/favoritos', favoritosRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.get('*', (req, res, next) => {
  const index = path.join(frontendDist, 'index.html');
  if (fs.existsSync(index)) return res.sendFile(index);
  next();
});

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
