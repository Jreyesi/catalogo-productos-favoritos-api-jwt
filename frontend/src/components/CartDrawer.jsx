import { imagenProducto } from '../productImages.js';
import { formatPrice } from '../utils/formatPrice.js';

export default function CartDrawer({ open, carrito, productos, usuario, onClose, onQty, onCheckout, onOpenAuth, onLogout }) {
  const lineas = carrito
    .map((item) => {
      const producto = productos.find((entry) => entry.id === item.id);
      return producto ? { ...item, producto } : null;
    })
    .filter(Boolean);

  const total = lineas.reduce((sum, linea) => sum + Number(linea.producto.precio) * linea.qty, 0);

  return (
    <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="scrim" onClick={onClose} />
      <div className="panel">
        <button className="close" type="button" onClick={onClose} aria-label="Cerrar">×</button>
        <h3>Tu pedido</h3>

        <div style={{ display: 'grid', gap: 10 }}>
          {lineas.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>Tu carrito está vacío.</p>
          ) : (
            lineas.map((linea) => (
              <div className="cart-line" key={linea.id}>
                <img src={imagenProducto(linea.producto)} alt={`Envase de ${linea.producto.nombre}`} />
                <div>
                  <h5>{linea.producto.nombre}</h5>
                  <p>{formatPrice(linea.producto.precio)}</p>
                </div>
                <div className="qty">
                  <button type="button" onClick={() => onQty(linea.id, -1)} aria-label="Reducir">−</button>
                  <span>{linea.qty}</span>
                  <button type="button" onClick={() => onQty(linea.id, 1)} aria-label="Aumentar">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 'auto', display: 'grid', gap: 12 }}>
          <div className="total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {usuario ? (
            <div className="field">
              <span>Atendiendo a {usuario.nombre}</span>
              <button className="session-pill" type="button" onClick={onLogout}>Cerrar sesión</button>
            </div>
          ) : (
            <button className="session-pill" type="button" onClick={onOpenAuth}>Acceder o registrarme</button>
          )}

          <button className="primary" type="button" disabled={lineas.length === 0} onClick={onCheckout}>
            Finalizar pedido
          </button>
        </div>
      </div>
    </aside>
  );
}
