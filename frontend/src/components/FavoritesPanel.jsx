import { imagenProducto } from '../productImages.js';

export default function FavoritesPanel({ favoritos, onQuitar, usuario }) {
  return (
    <aside className="panel panel--favoritos" aria-label="Mis favoritos">
      <h2>Mis favoritos</h2>
      {!usuario ? (
        <p className="panel__texto">Inicia sesion para guardar tus favoritos.</p>
      ) : favoritos.length === 0 ? (
        <p className="panel__texto">Aun no tienes favoritos.</p>
      ) : (
        <ul className="lista-favoritos">
          {favoritos.map((producto) => (
            <li key={producto.id}>
              <span className="favorito__nombre">
                <img src={imagenProducto(producto)} alt="" loading="lazy" />
                {producto.nombre}
              </span>
              <button type="button" className="enlace" onClick={() => onQuitar(producto.id)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
