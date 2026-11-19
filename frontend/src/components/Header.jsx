export default function Header({ cartCount, usuario, onOpenCart, onOpenAuth, onLogout }) {
  return (
    <header className="topbar">
      <div className="brandmark">
        <span className="bolt">⚡</span>
        IRONPULSE
      </div>
      <nav className="nav">
        <a href="#catalogo">Catálogo</a>
        <a href="#beneficios">Beneficios</a>
        <a href="#favoritos">Favoritos</a>
      </nav>
      <div className="spacer" />
      <button className="session-pill" type="button" onClick={usuario ? onLogout : onOpenAuth}>
        {usuario ? `Hola, ${usuario.nombre}` : 'Acceder / Registro'}
      </button>
      <button className="cart-btn" type="button" onClick={onOpenCart}>
        Carrito
        <span className="count">{cartCount}</span>
      </button>
    </header>
  );
}
