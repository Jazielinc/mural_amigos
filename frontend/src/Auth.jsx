// frontend/src/Auth.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Usamos los mismos estilos

function Auth({ onLogin }) {
  const [esRegistro, setEsRegistro] = useState(false); // Alternar entre Login y Registro
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Definir a qué URL vamos a llamar
    const url = esRegistro 
      ? 'http://127.0.0.1:8000/api/signup/' 
      : 'http://127.0.0.1:8000/api/login/';

    try {
      const response = await axios.post(url, {
        username: username,
        password: password
      });

      if (esRegistro) {
        // Si se registró con éxito, autologueamos o pedimos login
        alert('¡Cuenta creada! Ahora inicia sesión.');
        setEsRegistro(false); // Cambiamos a la vista de login
      } else {
        // Si es Login, recibimos el TOKEN
        const token = response.data.token;
        // Se lo pasamos a App.jsx para que abra las puertas
        onLogin(token); 
      }

    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos (o usuario ya existe).');
    }
  };

  return (
    <div className="post-card" style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', textAlign: 'center' }}>
      <h2>{esRegistro ? 'Crear Cuenta 📝' : 'Iniciar Sesión 🔐'}</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Usuario" value={username} 
          onChange={(e) => setUsername(e.target.value)} required
          style={{ padding: '10px' }}
        />
        <input 
          type="password" placeholder="Contraseña" value={password} 
          onChange={(e) => setPassword(e.target.value)} required
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#2563EB', color: 'white', border: 'none', cursor: 'pointer' }}>
          {esRegistro ? 'Registrarse' : 'Entrar'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        <button 
          onClick={() => setEsRegistro(!esRegistro)} 
          style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {esRegistro ? ' Inicia Sesión' : ' Regístrate aquí'}
        </button>
      </p>
    </div>
  );
}

export default Auth;