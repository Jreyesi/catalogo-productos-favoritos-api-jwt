import { useState } from 'react';

export default function AuthModal({ open, usuario, error, onClose, onAutenticar, onLogout }) {
  const [modo, setModo] = useState('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const enviar = (event) => {
    event.preventDefault();
    onAutenticar({ nombre, email, password, registro: modo === 'registro' });
  };

  return (
    <div className={`modal ${open ? 'open' : ''}`}>
      <div className="scrim" onClick={onClose} />
      <div className="modal-card">
        <button className="close" type="button" onClick={onClose} aria-label="Cerrar">×</button>
        {usuario ? (
          <>
            <span className="badge">Sesión activa</span>
            <h3>Hola, {usuario.nombre}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>{usuario.email}</p>
            <button className="primary" type="button" onClick={onLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <span className="badge">Acceso con JWT</span>
            <h3>{modo === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
              Tus favoritos se guardan en el servidor y viajan con tu token.
            </p>
            {error && <p className="error" role="alert">{error}</p>}
            <form onSubmit={enviar} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
              {modo === 'registro' && (
                <label className="field">
                  Nombre
                  <input
                    value={nombre}
                    onChange={(event) => setNombre(event.target.value)}
                    placeholder="Tu nombre"
                    required
                    minLength={3}
                  />
                </label>
              )}
              <label className="field">
                Correo
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nombre@correo.com"
                  required
                />
              </label>
              <label className="field">
                Contraseña
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </label>
              <button className="primary" type="submit">
                {modo === 'login' ? 'Entrar' : 'Registrarme'}
              </button>
            </form>
            <button
              className="session-pill"
              type="button"
              style={{ marginTop: 14, border: 0 }}
              onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            >
              {modo === 'login' ? '¿Sin cuenta? Regístrate' : '¿Ya tienes cuenta? Accede'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
