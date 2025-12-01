import { useState, useEffect } from 'react';
import api from '../api.js';

export default function FavoritesList() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api.get('/favorites').then(res => setFavorites(res.data));
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="font-semibold mb-2">Favorites</h2>
      {favorites.length === 0 ? <p>No favorites yet.</p> :
        favorites.map(f => <p key={f._id}>{f.title}</p>)
      }
    </div>
  );
}
