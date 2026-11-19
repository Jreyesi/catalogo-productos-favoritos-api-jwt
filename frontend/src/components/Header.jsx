export default function Header({ usuario, onLogout }) {
  return (
    <header className="cabecera">
      <div className="cabecera__marca">
        <span className="logo" aria-hidden="true">CF</span>
        <div>
          <h1>Catalogo Fit</h1>
          <p>Suplementos para tu entrenamiento</p>
        </div>
      </div>
      <nav aria-label="Navegacion principal">
        <a href="#catalogo">Catalogo</a>
        <a href="#favoritos">Favoritos</a>
      </nav>
      <div className="cabecera__usuario">
        {usuario ? (
          <>
            <span className="usuario__nombre">{usuario.nombre}</span>
            <button type="button" className="boton boton--suave" onClick={onLogout}>Salir</button>
          </>
        ) : (
          <span className="usuario__nombre">Invitado</span>
        )}
      </div>
    </header>
  );
}
