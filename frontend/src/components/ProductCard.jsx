import { imagenProducto } from '../productImages.js';

function BotonFavorito({ producto, esFavorito, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`marcador ${esFavorito ? 'marcador--activo' : ''} ${className}`}
      onClick={() => onToggle(producto.id)}
      aria-pressed={esFavorito}
    >
      {esFavorito ? 'Guardado' : 'Favorito'}
    </button>
  );
}

export default function ProductCard({ producto, esFavorito, onToggle, variante = 'normal' }) {
  const imagen = imagenProducto(producto);
  const nombre = producto?.nombre ?? 'Producto';
  const categoria = producto?.categoria ?? 'Catalogo';
  const favorito = (
    <BotonFavorito producto={producto} esFavorito={esFavorito} onToggle={onToggle} />
  );

  if (variante === 'foto') {
    return (
      <article className="pieza pieza--foto">
        <img src={imagen} alt={`Envase de ${nombre}`} loading="lazy" />
        <span className="pieza__etiqueta">{categoria}</span>
        {favorito}
      </article>
    );
  }

  if (variante === 'callout') {
    return (
      <article className="pieza pieza--callout">
        <span className="pieza__amplio">Nuestro producto</span>
        <strong>{nombre}</strong>
        <span className="pieza__detalle">{categoria}</span>
        {favorito}
        <span className="pieza__flecha" aria-hidden="true">↗</span>
      </article>
    );
  }

  if (variante === 'violeta') {
    return (
      <article className="pieza pieza--violeta">
        <div className="pieza__cabecera">
          <strong>{nombre}</strong>
          <span>{categoria} ↗</span>
        </div>
        <img src={imagen} alt={`Envase de ${nombre}`} loading="lazy" />
        {favorito}
      </article>
    );
  }

  if (variante === 'naranja') {
    return (
      <article className="pieza pieza--naranja">
        <strong>Unete si quieres mas energia !</strong>
        <div className="pieza__acciones">
          <BotonFavorito producto={producto} esFavorito={esFavorito} onToggle={onToggle} className="marcador--oscuro" />
          <a href="#favoritos">Ver favoritos ↗</a>
        </div>
      </article>
    );
  }

  if (variante === 'malva') {
    return (
      <article className="pieza pieza--malva">
        <div className="pieza__marco">
          <span className="pieza__badge">CF</span>
          <img src={imagen} alt={`Envase de ${nombre}`} loading="lazy" />
        </div>
        <span className="pieza__rol">{categoria} →</span>
        {favorito}
      </article>
    );
  }

  return (
    <article className="tarjeta">
      <div className="tarjeta__visual">
        <img src={imagen} alt={`Envase de ${nombre}`} loading="lazy" />
      </div>
      <header className="tarjeta__cabecera">
        <span className="etiqueta">{categoria}</span>
        <h3>{nombre}</h3>
      </header>
      <p className="tarjeta__descripcion">{producto?.descripcion}</p>
      <footer className="tarjeta__pie">
        <span className="precio">${Number(producto?.precio ?? 0).toFixed(2)}</span>
        {favorito}
      </footer>
    </article>
  );
}
