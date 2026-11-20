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
  if (error.status === 400 || error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido o petición mal formada' });
  }
  if (error.code === '22P02' || error.code === '22003') {
    return res.status(400).json({ error: 'Parámetro inválido' });
  }
  if (error.code === '23505') {
    return res.status(409).json({ error: 'Recurso duplicado' });
  }
  if (error.code === '23503') {
    return res.status(404).json({ error: 'Referencia inexistente' });
  }
  console.error(error.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
