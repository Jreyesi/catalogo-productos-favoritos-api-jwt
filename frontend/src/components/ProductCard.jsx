export default function ProductCard({ producto, esFavorito, onToggle, destacado }) {
  return (
    <article className={`tarjeta${destacado ? ' tarjeta--destacada' : ''}`}>
      <header className="tarjeta__cabecera">
        <span className="etiqueta">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
      </header>
      <p className="tarjeta__descripcion">{producto.descripcion}</p>
      <footer className="tarjeta__pie">
        <span className="precio">${Number(producto.precio).toFixed(2)}</span>
        <button
          type="button"
          className={`boton ${esFavorito ? 'boton--activo' : 'boton--suave'}`}
          onClick={() => onToggle(producto.id)}
          aria-pressed={esFavorito}
        >
          {esFavorito ? 'Quitar' : 'Favorito'}
        </button>
      </footer>
    </article>
  );
}
