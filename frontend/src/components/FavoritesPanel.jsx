import { imagenProducto } from '../productImages.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function FavoritesPanel({ favoritos, usuario, onQuitar, onAgregar, onAcceder }) {
  return (
    <section id="favoritos">
      <div className="section-head">
        <h2>Mis favoritos</h2>
        <span>{favoritos.length} guardado{favoritos.length === 1 ? '' : 's'}</span>
      </div>

      {!usuario ? (
        <div className="tile small lilac">
          <div>
            <h3>Inicia sesion para guardar tus favoritos.</h3>
            <p>Los favoritos se asocian a tu usuario mediante el token JWT.</p>
          </div>
          <button className="btn-dark" type="button" onClick={onAcceder}>Iniciar sesion</button>
        </div>
      ) : favoritos.length === 0 ? (
        <div className="tile small lilac">
          <div>
            <h3>Aún no tienes favoritos.</h3>
            <p>Pulsa el corazón en cualquier producto del catálogo.</p>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {favoritos.map((producto) => (
            <article className="product" key={producto.id}>
              <img src={imagenProducto(producto)} alt={`Envase de ${producto.nombre}`} loading="lazy" />
              <div className="body">
                <span className="cat">{producto.categoria}</span>
                <h4>{producto.nombre}</h4>
                <p className="desc">{producto.descripcion}</p>
                <div className="row">
                  <span className="price">{formatPrice(producto.precio)}</span>
                  <button className="icon-btn on" type="button" title="Quitar" onClick={() => onQuitar(producto.id)}>
                    ♥
                  </button>
                </div>
                <button className="add-btn" type="button" onClick={() => onAgregar(producto)}>Añadir al carrito</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
