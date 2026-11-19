const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esIdValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0;
}

function validarRegistro(cuerpo) {
  const errores = [];
  const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim() : '';
  const password = typeof cuerpo.password === 'string' ? cuerpo.password : '';

  if (!nombre) errores.push({ campo: 'nombre', mensaje: 'Es obligatorio' });
  else if (nombre.length > 100) errores.push({ campo: 'nombre', mensaje: 'No puede superar 100 caracteres' });

  if (!email) errores.push({ campo: 'email', mensaje: 'Es obligatorio' });
  else if (!EMAIL_RE.test(email)) errores.push({ campo: 'email', mensaje: 'Debe ser un correo válido' });

  if (!password) errores.push({ campo: 'password', mensaje: 'Es obligatorio' });
  else if (password.length < 8) errores.push({ campo: 'password', mensaje: 'Debe tener al menos 8 caracteres', status: 422 });

  const status = errores.length === 1 && errores[0].status === 422 ? 422 : 400;
  return { errores, datos: { nombre, email, password }, status };
}

function validarLogin(cuerpo) {
  const errores = [];
  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim() : '';
  const password = typeof cuerpo.password === 'string' ? cuerpo.password : '';

  if (!email || !EMAIL_RE.test(email)) errores.push({ campo: 'email', mensaje: 'Debe ser un correo válido' });
  if (!password) errores.push({ campo: 'password', mensaje: 'Es obligatorio' });

  return { errores, datos: { email, password } };
}

function validarProducto(cuerpo) {
  const errores = [];
  const texto = (campo, max) => {
    const valor = cuerpo[campo];
    if (typeof valor !== 'string' || valor.trim().length === 0) {
      errores.push({ campo, mensaje: 'Es obligatorio y no puede estar vacío' });
      return '';
    }
    if (valor.trim().length > max) {
      errores.push({ campo, mensaje: `No puede superar ${max} caracteres` });
      return '';
    }
    return valor.trim();
  };

  const nombre = texto('nombre', 150);
  const descripcion = texto('descripcion', 2000);
  const categoria = texto('categoria', 80);

  const precio = Number(cuerpo.precio);
  if (cuerpo.precio === undefined || cuerpo.precio === null || cuerpo.precio === '' || Number.isNaN(precio)) {
    errores.push({ campo: 'precio', mensaje: 'Debe ser un número' });
  } else if (precio <= 0) {
    errores.push({ campo: 'precio', mensaje: 'Debe ser mayor que cero', status: 422 });
  }

  const status = errores.some((e) => e.status === 422) && errores.length === 1 ? 422 : 400;
  return { errores, datos: { nombre, descripcion, categoria, precio }, status };
}

module.exports = { esIdValido, validarRegistro, validarLogin, validarProducto };
