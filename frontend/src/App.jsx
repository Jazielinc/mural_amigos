// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import PostForm from './PostForm';
import Auth from './Auth'; // <--- Importamos el componente de login
import './App.css'

function App() {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); // 1. Buscamos token guardado

  // Configuración de columnas
  const breakpointColumnsObj = { default: 3, 1100: 2, 700: 1 };

  // --- FUNCIÓN DE LOGIN ---
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken); // Guardar en el navegador para no perder sesión
  };

  // --- FUNCIÓN DE LOGOUT ---
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Borrar del navegador
    setPosts([]); // Limpiar posts de la memoria
  };

  // --- CARGAR POSTS ---
  const fetchPosts = () => {
    if (!token) return; // Si no hay llave, no intentes llamar a la API

    // Configurar Axios para que use la llave en cada petición
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;

    axios.get('http://127.0.0.1:8000/api/posts/')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          // Si el token venció o es falso, sacar al usuario
          handleLogout(); 
        }
      });
  }

  // Ejecutar cuando cambia el token (al loguearse o al cargar la página)
  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  // --- RENDERIZADO CONDICIONAL ---
  
  // Si NO hay token, mostramos solo el Login
  if (!token) {
    return (
      <div className="app-container">
        <header><h1>Mural de Amigos 🌍</h1></header>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  // Si HAY token, mostramos la App completa
  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Mural de Amigos 🌍</h1>
        <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Pasamos fetchPosts para que se actualice al subir algo */}
        <PostForm onPostCreated={fetchPosts} />
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {post.tipo === 'IMAGEN' && post.imagen && (
              <img src={post.imagen} alt={post.titulo} />
            )}
            
            {post.tipo === 'VIDEO' && post.video && (
              <video controls src={post.video} style={{ width: '100%', display: 'block', backgroundColor: '#000' }} />
            )}

            {post.tipo === 'LINK' && (
              <div style={{ padding: '10px', backgroundColor: '#f3f4f6', textAlign: 'center' }}>
                <a href={post.url_externa} target="_blank" rel="noopener noreferrer" style={{color: '#2563EB', fontWeight: 'bold'}}>
                  🔗 Ver enlace original
                </a>
              </div>
            )}
            
            <div className="post-content">
              <h3>{post.titulo}</h3>
              <p>{post.contenido_texto}</p>

              {/* NUEVO PIE DE TARJETA CON AVATAR */}
              <div className="post-footer">
                
                {post.autor_avatar ? (
                  <img 
                    /* Concatenamos la URL del servidor */
                    src={`http://127.0.0.1:8000${post.autor_avatar}`} 
                    alt={post.autor_nombre} 
                    className="avatar-img"
                  />
                ) : (
                  /* Si no tiene foto, mostramos un círculo gris genérico */
                  <div className="avatar-placeholder">👤</div>
                )}

                <div className="author-info">
                  <span className="author-name">{post.autor_nombre}</span>
                  <span className="post-location">📍 {post.ubicacion_origen}</span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  )
}

export default App