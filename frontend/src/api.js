const BASE = '/api';

function leerToken() {
  return localStorage.getItem('token');
}

async function pedir(ruta, opciones = {}) {
  const cabeceras = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  const token = leerToken();
  if (token) cabeceras.Authorization = `Bearer ${token}`;

  const respuesta = await fetch(`${BASE}${ruta}`, { ...opciones, headers: cabeceras });
  const texto = await respuesta.text();
  const datos = texto ? JSON.parse(texto) : null;

  if (!respuesta.ok) {
    const error = new Error(datos?.error || 'Error al procesar la solicitud');
    error.status = respuesta.status;
    throw error;
  }
  return datos;
}

export const api = {
  listarProductos: (categoria) =>
    pedir(`/productos${categoria ? `?categoria=${encodeURIComponent(categoria)}` : ''}`),
  login: (email, password) =>
    pedir('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  registro: (nombre, email, password) =>
    pedir('/auth/registro', { method: 'POST', body: JSON.stringify({ nombre, email, password }) }),
  listarFavoritos: () => pedir('/favoritos'),
  agregarFavorito: (productoId) =>
    pedir('/favoritos', { method: 'POST', body: JSON.stringify({ productoId }) }),
  quitarFavorito: (productoId) => pedir(`/favoritos/${productoId}`, { method: 'DELETE' }),
};
