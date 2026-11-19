function esIdValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0;
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
  const datos = { nombre, descripcion, categoria, precio };
  return { errores, datos, status };
}

module.exports = { esIdValido, validarProducto };
