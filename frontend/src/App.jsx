// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import Masonry from 'react-masonry-css'
import PostForm from './PostForm';
import ProfileForm from './ProfileForm'; // <--- Importar
import Auth from './Auth'; // <--- Importamos el componente de login
import { SocialEmbed } from './SocialEmbed';
import './App.css'

function App() {
  const [view, setView] = useState('mural'); 
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); // 1. Buscamos token guardado
  const [currentUser, setCurrentUser] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

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

  // --- OBTENER USUARIO ACTUAL ---
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      axios.get('http://127.0.0.1:8000/api/profile/')
        .then(response => {
          setCurrentUser(response.data);
        })
        .catch(err => console.error(err));

      fetchPosts();
    }
  }, [token]);

  // --- BORRAR POST ---
  const handleDeletePost = (postId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta publicación?")) return;

    axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/`)
      .then(() => {
        setPosts(posts.filter(p => p.id !== postId));
      })
      .catch(err => alert("Error al eliminar"));
  };

  // --- COMENTARIOS ---
  const handleCommentChange = (postId, text) => {
    setCommentInputs({ ...commentInputs, [postId]: text });
  };

  const handleSubmitComment = (postId) => {
    const text = commentInputs[postId];
    if (!text) return;

    axios.post('http://127.0.0.1:8000/api/comments/', {
      post: postId,
      texto: text
    })
    .then(response => {
       const newComment = response.data;
       setPosts(posts.map(p => {
         if (p.id === postId) {
           return { ...p, comentarios: [...(p.comentarios || []), newComment] };
         }
         return p;
       }));
       setCommentInputs({ ...commentInputs, [postId]: '' });
    })
    .catch(err => console.error(err));
  };

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
                   <SocialEmbed url={post.url_externa} />
                )}
                
                <div className="post-content">
                  {currentUser && currentUser.user_id === post.autor && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}
                      title="Eliminar publicación"
                    >
                      🗑️
                    </button>
                  )}
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

                  {/* COMENTARIOS */}
                  <div className="comments-section" style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    {post.comentarios && post.comentarios.map(comment => (
                        <div key={comment.id} style={{
                            fontSize: '0.9em',
                            marginBottom: '8px',
                            textAlign: 'left',
                            backgroundColor: '#f9fafb',
                            padding: '8px',
                            borderRadius: '5px',
                            color: '#1f2937'
                        }}>
                            <strong style={{ color: '#4b5563' }}>{comment.autor_nombre}:</strong> {comment.texto}
                        </div>
                    ))}
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <input
                            type="text"
                            placeholder="Comentar..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                        <button
                            onClick={() => handleSubmitComment(post.id)}
                            style={{ marginLeft: '5px', padding: '5px 10px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            ➤
                        </button>
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