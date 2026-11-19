require('dotenv').config();
const app = require('./app');

const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`API escuchando en http://localhost:${puerto}`);
});
