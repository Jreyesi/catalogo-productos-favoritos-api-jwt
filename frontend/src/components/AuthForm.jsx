import { useState } from 'react';

export default function AuthForm({ onAutenticar, error }) {
  const [modo, setModo] = useState('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function enviar(evento) {
    evento.preventDefault();
    onAutenticar({ nombre, email, password, registro: modo === 'registro' });
  }

  return (
    <section className="panel panel--auth" aria-label="Acceso">
      <h2>{modo === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}</h2>
      <p className="panel__texto">Ingresa para guardar tus productos favoritos.</p>
      <form onSubmit={enviar}>
        {modo === 'registro' && (
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required minLength={3} />
          </label>
        )}
        <label>
          Correo
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contrasena
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </label>
        <button type="submit" className="boton boton--primario">
          {modo === 'login' ? 'Entrar' : 'Registrarme'}
        </button>
      </form>
      <button
        type="button"
        className="enlace"
        onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
      >
        {modo === 'login' ? 'Crear una cuenta' : 'Ya tengo cuenta'}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
