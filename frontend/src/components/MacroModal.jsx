import { metadatosProducto } from '../data/productos.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function MacroModal({ producto, onClose, onAgregar }) {
  if (!producto) {
    return null;
  }

  const meta = metadatosProducto(producto);

  return (
    <div className="modal open">
      <div className="scrim" onClick={onClose} />
      <div className="modal-card">
        <button className="close" type="button" onClick={onClose} aria-label="Cerrar">×</button>
        <span className="badge">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>{producto.descripcion}</p>
        <div className="macros">
          <div className="macro">
            <small>Activo clave</small>
            <b>{meta.protein}</b>
          </div>
          <div className="macro">
            <small>Dosis</small>
            <b>{meta.servings}</b>
          </div>
          <div className="macro">
            <small>Objetivo</small>
            <b>{meta.goal}</b>
          </div>
        </div>
        <div className="total">
          <span>Precio</span>
          <span>{formatPrice(producto.precio)}</span>
        </div>
        <button className="primary" type="button" style={{ width: '100%', marginTop: 16 }} onClick={() => onAgregar(producto)}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
