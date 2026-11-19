import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import Header from './components/Header.jsx';
import AuthForm from './components/AuthForm.jsx';
import ProductCard from './components/ProductCard.jsx';
import FavoritesPanel from './components/FavoritesPanel.jsx';

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

  return (
    <>
      <Header usuario={usuario} onLogout={cerrarSesion} />
      <main className="contenido">
        <section className="hero">
          <p className="hero__etiqueta">Catalogo 2026</p>
          <h2>Suplementos que acompanan tu esfuerzo</h2>
          <p>Explora la linea de productos, filtra por objetivo y guarda tus favoritos.</p>
        </section>

        {error && <p className="error" role="alert">{error}</p>}

        <div className="diseno">
          <section id="catalogo" className="catalogo" aria-label="Catalogo de productos">
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

            {cargando ? (
              <p className="panel__texto">Cargando productos...</p>
            ) : (
              <div className="bento">
                {productos.map((producto, indice) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    destacado={indice === 0 && categoria === ''}
                    esFavorito={favoritos.some((item) => item.id === producto.id)}
                    onToggle={alternarFavorito}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="columna-lateral">
            <div id="favoritos">
              <FavoritesPanel favoritos={favoritos} onQuitar={alternarFavorito} usuario={usuario} />
            </div>
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
