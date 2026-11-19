import { metadatosProducto } from '../data/productos.js';
import { imagenProducto } from '../productImages.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function ProductCard({ producto, esFavorito, onToggle, onDetalle, onAgregar }) {
  const meta = metadatosProducto(producto);

  return (
    <article className="product">
      <img src={imagenProducto(producto)} alt={`Envase de ${producto.nombre}`} loading="lazy" />
      <div className="body">
        <span className="cat">{producto.categoria}</span>
        <h4>{producto.nombre}</h4>
        <p className="desc">{producto.descripcion}</p>
        <p className="desc">{meta.protein} · {meta.servings}</p>
        <div className="row">
          <span className="price">{formatPrice(producto.precio)}</span>
          <div className="actions">
            <button
              className={`icon-btn ${esFavorito ? 'on' : ''}`}
              type="button"
              title={esFavorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              aria-pressed={esFavorito}
              onClick={() => onToggle(producto.id)}
            >
              ♥
            </button>
            <button className="icon-btn" type="button" title="Ver macros" onClick={() => onDetalle(producto)}>
              i
            </button>
          </div>
        </div>
        <button className="add-btn" type="button" onClick={() => onAgregar(producto)}>Añadir al carrito</button>
      </div>
    </article>
  );
}
