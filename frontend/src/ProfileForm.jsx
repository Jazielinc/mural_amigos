// frontend/src/ProfileForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileForm({ onBack }) {
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null); // Para ver la foto antes de subirla
  const [cargando, setCargando] = useState(false);

  // 1. Cargar datos actuales del usuario al abrir
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/profile/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(response => {
      setBio(response.data.bio);
      
      const avatarData = response.data.avatar;
      
      if (avatarData) {
        // --- CORRECCIÓN AQUÍ ---
        // Verificamos si Django ya nos dio la URL completa (empieza con http)
        if (avatarData.startsWith('http')) {
          setPreview(avatarData); 
        } else {
          // Si nos dio solo la ruta corta (/media/...), le pegamos el dominio
          setPreview(`http://127.0.0.1:8000${avatarData}`);
        }
      }
    })
    .catch(error => console.error("Error cargando perfil", error));
  }, []);

  // 2. Manejar la selección de nueva foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file)); // Truco para previsualizar sin subir
  };

  // 3. Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('bio', bio);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      // Usamos PATCH porque estamos actualizando, no creando
      await axios.patch('http://127.0.0.1:8000/api/profile/', formData, {
        headers: { 
          'Authorization': `Token ${token}`
          // Axios pone el Content-Type multipart automáticamente
        }
      });
      alert('¡Perfil actualizado! 😎');
      onBack(); // Volver al mural
    } catch (error) {
      console.error(error);
      alert('Error al actualizar.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="post-card" style={{ maxWidth: '500px', margin: '20px auto', padding: '30px' }}>
      <h2>Editar Mi Perfil ✏️</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Previsualización del Avatar */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', 
            overflow: 'hidden', margin: '0 auto', border: '3px solid #ddd' 
          }}>
            {preview ? (
              <img src={preview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            )}
          </div>
          <br/>
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>

        <textarea 
          placeholder="Escribe algo sobre ti..." 
          value={bio} 
          onChange={(e) => setBio(e.target.value)}
          rows="3"
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" onClick={onBack} style={{ flex: 1, padding: '10px', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={cargando}
            style={{ flex: 1, padding: '10px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {cargando ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;