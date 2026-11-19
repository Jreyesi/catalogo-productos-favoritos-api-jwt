export default function FilterToolbar({ categorias, categoria, query, onCategoria, onQuery }) {
  return (
    <div className="tools">
      <div className="chips">
        {categorias.map((item) => (
          <button
            key={item}
            type="button"
            className={`chip ${categoria === item ? 'active' : ''}`}
            onClick={() => onCategoria(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <label className="search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={query}
          placeholder="Buscar suplemento..."
          onChange={(event) => onQuery(event.target.value)}
        />
      </label>
    </div>
  );
}
