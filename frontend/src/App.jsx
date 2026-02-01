// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import PostForm from './PostForm';
import ProfileForm from './ProfileForm'; // <--- Importar
import Auth from './Auth'; // <--- Importamos el componente de login
import './App.css'

function App() {
  const [view, setView] = useState('mural'); 
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

  return (
    <div className="app-container">
      {/* CABECERA CON MENÚ */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setView('mural')}>
          Mural de Amigos 🌍
        </h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setView('perfil')} 
            style={{ padding: '8px 15px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            👤 Mi Perfil
          </button>
          
          <button 
            onClick={handleLogout} 
            style={{ padding: '8px 15px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* RENDERIZADO CONDICIONAL: ¿Qué mostramos? */}
      
      {view === 'perfil' ? (
        // SI ESTAMOS EN MODO PERFIL:
        <ProfileForm onBack={() => {
          setView('mural'); // Volver al mural
          fetchPosts();     // Recargar posts para ver la foto nueva
        }} />
      ) : (
        // SI ESTAMOS EN MODO MURAL (Lo normal):
        <>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                  
                  {/* Footer con avatar (ya lo tenías, asegúrate de mantenerlo) */}
                  <div className="post-footer">
                    {post.autor_avatar ? (
                      <img src={`http://127.0.0.1:8000${post.autor_avatar}`} className="avatar-img" />
                    ) : (
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
        </>
      )}
    </div>
  )
}

export default App