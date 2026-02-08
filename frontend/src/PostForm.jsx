// frontend/src/PostForm.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css';

function PostForm({ onPostCreated }) {
  const [modo, setModo] = useState('IMAGEN');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [url, setUrl] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // 1. RECUPERAR EL TOKEN (La llave de acceso)
    const token = localStorage.getItem('token'); 
    
    console.log("Token recuperado:", token);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido_texto', contenido);
    formData.append('ubicacion_origen', ubicacion);
    formData.append('tipo', modo);
    
    if (modo === 'IMAGEN' && archivo) formData.append('imagen', archivo);
    if (modo === 'VIDEO' && archivo) formData.append('video', archivo);
    if (modo === 'LINK') formData.append('url_externa', url);

    try {
      // 2. ENVIAR EL TOKEN EN LOS HEADERS
      await axios.post('http://127.0.0.1:8000/api/posts/', formData, {
        headers: {
          'Authorization': `Token ${token}`, // <--- ¡AQUÍ ESTABA EL FALTANTE!
          // Nota: No agregamos 'Content-Type', axios lo pone solo para los archivos
        },
      });
      
      setTitulo(''); setContenido(''); setArchivo(null); setUrl(''); setUbicacion('');
      alert('¡Publicado!');
      if (onPostCreated) onPostCreated();

    } catch (error) {
      console.error('Error:', error);
      alert('Error al publicar. Asegúrate de haber iniciado sesión.');
    } finally {
      setCargando(false);
    }
  };

  // ... (El resto del return y el HTML se queda igual) ...
  return (
    <div className="post-card" style={{ padding: '20px', marginBottom: '40px' }}>
    {/* ... todo el código visual que ya tenías ... */}
      <h2 style={{marginTop: 0, color: '#333'}}>Nuevo Recuerdo 📸</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button type="button" onClick={() => setModo('IMAGEN')} style={{ opacity: modo === 'IMAGEN' ? 1 : 0.5 }}>📸 Foto</button>
        <button type="button" onClick={() => setModo('VIDEO')} style={{ opacity: modo === 'VIDEO' ? 1 : 0.5 }}>🎥 Video</button>
        <button type="button" onClick={() => setModo('LINK')} style={{ opacity: modo === 'LINK' ? 1 : 0.5 }}>🔗 Link</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" placeholder="Título..." required value={titulo} 
          onChange={(e) => setTitulo(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <textarea 
          placeholder="Descripción..." value={contenido} rows="2"
          onChange={(e) => setContenido(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        {modo === 'IMAGEN' && (
          <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} required />
        )}

        {modo === 'VIDEO' && (
          <input type="file" accept="video/*" onChange={(e) => setArchivo(e.target.files[0])} required />
        )}

        {modo === 'LINK' && (
          <input type="url" placeholder="https://instagram.com/p/..., https://youtu.be/..." value={url} onChange={(e) => setUrl(e.target.value)} required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        )}

        <input 
          type="text" placeholder="📍 ¿Dónde estás?" value={ubicacion} 
          onChange={(e) => setUbicacion(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button 
          type="submit" disabled={cargando}
          style={{ padding: '12px', backgroundColor: '#2563EB', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          {cargando ? 'Subiendo...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}

export default PostForm;