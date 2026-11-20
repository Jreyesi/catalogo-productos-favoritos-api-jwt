require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('JWT_SECRET debe estar configurado con al menos 16 caracteres');
  process.exit(1);
}

if (!process.env.JWT_EXPIRES_IN || !/^(\d+|\d+(s|m|h|d|w|y))$/.test(process.env.JWT_EXPIRES_IN)) {
  console.error('JWT_EXPIRES_IN debe tener un formato válido, por ejemplo 1h');
  process.exit(1);
}

const app = require('./app');

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`API escuchando en http://localhost:${puerto}`);
});
