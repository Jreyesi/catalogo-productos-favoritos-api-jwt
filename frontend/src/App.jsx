import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import Header from './components/Header.jsx';
import AuthForm from './components/AuthForm.jsx';
import ProductCard from './components/ProductCard.jsx';
import FavoritesPanel from './components/FavoritesPanel.jsx';
import { imagenProducto } from './productImages.js';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      setProductos(await api.listarProductos(categoria));
      setError('');
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setCargando(false);
    }
  }, [categoria]);

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
    cargarProductos();
  }, [cargarProductos]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const datos = localStorage.getItem('usuario');
    if (token && datos) {
      setUsuario(JSON.parse(datos));
      cargarFavoritos();
    }
  }, [cargarFavoritos]);

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
      setError('');
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setFavoritos([]);
  }

  async function alternarFavorito(productoId) {
    if (!usuario) {
      setError('Inicia sesion para usar favoritos');
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
    } catch (fallo) {
      setError(fallo.message);
    }
  }

  const categorias = [...new Set(productos.map((producto) => producto.categoria))];
  const esFavorito = (id) => favoritos.some((item) => item.id === id);
  const filtros = (
    <div className="filtros" role="group" aria-label="Filtrar por categoria">
      <button
        type="button"
        className={categoria === '' ? 'chip chip--activo' : 'chip'}
        onClick={() => setCategoria('')}
      >
        Todos
      </button>
      {categorias.map((nombre) => (
        <button
          key={nombre}
          type="button"
          className={categoria === nombre ? 'chip chip--activo' : 'chip'}
          onClick={() => setCategoria(nombre)}
        >
          {nombre}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Header usuario={usuario} onLogout={cerrarSesion} />
      <main className="contenido">
        {error && <p className="error" role="alert">{error}</p>}

        {cargando ? (
          <p className="panel__texto">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="panel__texto">No hay productos para mostrar.</p>
        ) : categoria !== '' || productos.length < 5 ? (
          <section id="catalogo" className="catalogo-filtrado" aria-label="Catalogo filtrado">
            {filtros}
            <div className="bento">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  esFavorito={esFavorito(producto.id)}
                  onToggle={alternarFavorito}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="marco-bento" id="catalogo">
            <aside className="bloque-marca" aria-label="Marca y filtros">
              <div className="marca">
                <span className="marca__logo" aria-hidden="true">CF</span>
                <span className="marca__nombre">Catalogo Fit</span>
              </div>
              <p className="marca__subtitulo">Equipo y suplementos</p>
              <h2 className="marca__titulo">Entrena junto a tu mejor equipo.</h2>
              <p className="marca__texto">
                Explora la linea de suplementos, filtra por objetivo y guarda tus favoritos.
              </p>
              {filtros}
              <a className="pill pill--clara" href="#bloques">Ver catalogo</a>

              <div className="marca__inferior">
                <div className="retrato">
                  <img src={imagenProducto(productos[0])} alt={`Envase de ${productos[0].nombre}`} />
                  <span className="retrato__etiqueta">
                    Pick 5 / 195 <i aria-hidden="true" />
                  </span>
                </div>
                <div className="arco" aria-hidden="true" />
                <div className="marca__nota">
                  <strong>Somos Catalogo Fit</strong>
                  <p>Suplementos pensados para hipertrofia, recuperacion y energia.</p>
                  <a href="#favoritos">Conoce la historia ↗</a>
                </div>
              </div>
            </aside>

            <div className="bloques-derecha" id="bloques">
              <section className="bloque-lila" aria-label="Destacado">
                <nav className="bloque-lila__nav" aria-label="Navegacion del destacado">
                  <a href="#catalogo">Producto</a>
                  <a href="#catalogo">Historia</a>
                  <a href="#bloques">Beneficios</a>
                  <a href="#favoritos">Contacto</a>
                  <a className="pill pill--clara" href="#acceso">Registro</a>
                </nav>
                <div className="bloque-lila__contenido">
                  <img src={imagenProducto(productos[1])} alt={`Envase de ${productos[1].nombre}`} />
                  <div className="bloque-lila__texto">
                    <h3>Entrena <strong>en todas partes</strong></h3>
                    <p>Catalogo, favoritos y seguimiento en un solo lugar.</p>
                    <a className="pill pill--lima" href="#catalogo">Ver catalogo</a>
                  </div>
                </div>
              </section>

              <div className="fila fila--media">
                <ProductCard
                  producto={productos[2]}
                  esFavorito={esFavorito(productos[2].id)}
                  onToggle={alternarFavorito}
                  variante="foto"
                />
                <ProductCard
                  producto={productos[2]}
                  esFavorito={esFavorito(productos[2].id)}
                  onToggle={alternarFavorito}
                  variante="callout"
                />
                <ProductCard
                  producto={productos[3]}
                  esFavorito={esFavorito(productos[3].id)}
                  onToggle={alternarFavorito}
                  variante="violeta"
                />
              </div>

              <div className="fila fila--inferior">
                <ProductCard
                  producto={productos[0]}
                  esFavorito={esFavorito(productos[0].id)}
                  onToggle={alternarFavorito}
                  variante="naranja"
                />
                <ProductCard
                  producto={productos[4]}
                  esFavorito={esFavorito(productos[4].id)}
                  onToggle={alternarFavorito}
                  variante="malva"
                />
              </div>
            </div>
          </div>
        )}

        <div className="utilidades">
          <div id="favoritos">
            <FavoritesPanel favoritos={favoritos} onQuitar={alternarFavorito} usuario={usuario} />
          </div>
          <div id="acceso">
            {!usuario && <AuthForm onAutenticar={autenticar} error="" />}
          </div>
        </div>
      </main>
      <footer className="pie">
        <p>Catalogo Fit · Proyecto academico de API REST con JWT</p>
      </footer>
    </>
  );
}
