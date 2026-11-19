import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import AuthModal from './components/AuthModal.jsx';
import BentoGrid from './components/BentoGrid.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FavoritesPanel from './components/FavoritesPanel.jsx';
import FilterToolbar from './components/FilterToolbar.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import MacroModal from './components/MacroModal.jsx';
import ProductCard from './components/ProductCard.jsx';
import Toast from './components/Toast.jsx';
import usePersistentState from './hooks/usePersistentState.js';

export default function App() {
  const [catalogo, setCatalogo] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [query, setQuery] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [carrito, setCarrito] = usePersistentState('ironpulse_cart', []);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [authAbierto, setAuthAbierto] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [toast, setToast] = useState('');

  const cargarFavoritos = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setFavoritos([]);
      return;
    }
    try {
      setFavoritos(await api.listarFavoritos());
    } catch (fallo) {
      setError(fallo.message);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    api.listarProductos()
      .then((datos) => {
        if (activo) setCatalogo(datos);
      })
      .catch((fallo) => {
        if (activo) setError(fallo.message);
      });
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    api.listarProductos(categoria)
      .then((datos) => {
        if (!activo) return;
        setProductos(datos);
        setError('');
      })
      .catch((fallo) => {
        if (!activo) return;
        setProductos([]);
        setError(fallo.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => { activo = false; };
  }, [categoria]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const datos = localStorage.getItem('usuario');
    if (token && datos) {
      setUsuario(JSON.parse(datos));
      cargarFavoritos();
    }
  }, [cargarFavoritos]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const categorias = useMemo(
    () => ['Todos', ...new Set(catalogo.map((producto) => producto.categoria))],
    [catalogo],
  );

  const resultados = useMemo(() => {
    const termino = query.trim().toLowerCase();
    return productos.filter((producto) => {
      const texto = `${producto.nombre} ${producto.categoria} ${producto.descripcion}`.toLowerCase();
      return !termino || texto.includes(termino);
    });
  }, [productos, query]);

  const cartCount = carrito.reduce((sum, item) => sum + item.qty, 0);

  async function autenticar({ nombre, email, password, registro }) {
    try {
      if (registro) {
        await api.registro(nombre, email, password);
      }
      const sesion = await api.login(email, password);
      localStorage.setItem('token', sesion.token);
      localStorage.setItem('usuario', JSON.stringify(sesion.usuario));
      setUsuario(sesion.usuario);
      await cargarFavoritos();
      setAuthAbierto(false);
      setError('');
      setToast(`Bienvenido, ${sesion.usuario.nombre}`);
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setFavoritos([]);
    setAuthAbierto(false);
    setToast('Sesión cerrada');
  }

  async function alternarFavorito(productoId) {
    if (!usuario) {
      setError('Inicia sesion para usar favoritos');
      setAuthAbierto(true);
      return;
    }
    const existe = favoritos.some((item) => item.id === productoId);
    try {
      if (existe) {
        await api.quitarFavorito(productoId);
      } else {
        await api.agregarFavorito(productoId);
      }
      await cargarFavoritos();
      setError('');
      setToast(existe ? 'Quitado de favoritos' : 'Guardado en favoritos');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  function agregarAlCarrito(producto) {
    if (!producto?.id) return;
    setCarrito((actual) => {
      const existente = actual.find((item) => item.id === producto.id);
      if (existente) {
        return actual.map((item) => (
          item.id === producto.id ? { ...item, qty: item.qty + 1 } : item
        ));
      }
      return [...actual, { id: producto.id, qty: 1 }];
    });
    setToast(`${producto.nombre} añadido`);
  }

  function cambiarCantidad(productoId, delta) {
    setCarrito((actual) => actual
      .map((item) => (item.id === productoId ? { ...item, qty: item.qty + delta } : item))
      .filter((item) => item.qty > 0));
  }

  function finalizarPedido() {
    setCarrito([]);
    setCarritoAbierto(false);
    setToast('Pedido confirmado (demo)');
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        usuario={usuario}
        onOpenCart={() => setCarritoAbierto(true)}
        onOpenAuth={() => setAuthAbierto(true)}
        onLogout={cerrarSesion}
      />

      <main className="wrap">
        {error && <p className="error" role="alert">{error}</p>}

        <div className="hero-head">
          <div>
            <div className="kicker">Suplementos de precisión</div>
            <h1>Rendimiento<br /><em>sin excusas.</em></h1>
          </div>
          <p>
            Catálogo público, favoritos por usuario y una composición visual pensada para
            entrenar, recuperar y volver a darlo todo.
          </p>
        </div>

        {catalogo.length > 0 ? (
          <BentoGrid productos={catalogo} onQuickAdd={agregarAlCarrito} />
        ) : (
          <p className="panel__texto">Cargando productos...</p>
        )}

        <FilterToolbar
          categorias={categorias}
          categoria={categoria}
          query={query}
          onCategoria={setCategoria}
          onQuery={setQuery}
        />

        <section id="catalogo">
          <div className="section-head">
            <h2>Catálogo</h2>
            <span>{resultados.length} resultados</span>
          </div>

          {cargando ? (
            <p className="panel__texto">Cargando productos...</p>
          ) : resultados.length === 0 ? (
            <p className="panel__texto">No hay productos para mostrar.</p>
          ) : (
            <div className="product-grid">
              {resultados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  esFavorito={favoritos.some((item) => item.id === producto.id)}
                  onToggle={alternarFavorito}
                  onDetalle={setProductoDetalle}
                  onAgregar={agregarAlCarrito}
                />
              ))}
            </div>
          )}
        </section>

        <FavoritesPanel
          favoritos={favoritos}
          usuario={usuario}
          onQuitar={alternarFavorito}
          onAgregar={agregarAlCarrito}
          onAcceder={() => setAuthAbierto(true)}
        />
      </main>

      <Footer />

      <CartDrawer
        open={carritoAbierto}
        carrito={carrito}
        productos={catalogo}
        usuario={usuario}
        onClose={() => setCarritoAbierto(false)}
        onQty={cambiarCantidad}
        onCheckout={finalizarPedido}
        onOpenAuth={() => setAuthAbierto(true)}
        onLogout={cerrarSesion}
      />

      <AuthModal
        open={authAbierto}
        usuario={usuario}
        error={error}
        onClose={() => setAuthAbierto(false)}
        onAutenticar={autenticar}
        onLogout={cerrarSesion}
      />

      <MacroModal
        producto={productoDetalle}
        onClose={() => setProductoDetalle(null)}
        onAgregar={agregarAlCarrito}
      />

      <Toast message={toast} />
    </>
  );
}
