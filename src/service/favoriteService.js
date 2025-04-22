import axios from "../api/axios"

const FAVORITES_API = "/favorites"

// favoriteService.js
export const getFavorites = () => {
    const favorites = localStorage.getItem('perlacoif_favorites');
    return favorites ? JSON.parse(favorites) : [];
  };
  
  export const addToFavorites = (productId) => {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      localStorage.setItem('perlacoif_favorites', JSON.stringify(favorites));
      window.dispatchEvent(new Event('storage'));
    }
  };
  
  export const removeFromFavorites = (productId) => {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(id => id !== productId);
    localStorage.setItem('perlacoif_favorites', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event('storage'));
  };
  
  export const checkIsFavorite = (productId) => {
    const favorites = getFavorites();
    return favorites.includes(productId);
  };
  
  export const clearFavorites = () => {
    localStorage.removeItem('perlacoif_favorites');
    window.dispatchEvent(new Event('storage'));
  };
