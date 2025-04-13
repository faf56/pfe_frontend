import axios from "../api/axios";
const LIVRAISON_API="/livraisons"

export const fetchLivraisons = async () => {
  return await axios.get(LIVRAISON_API);
};

export const fetchLivraisonById = async (livraisonId) => {
  return await axios.get(LIVRAISON_API + '/' + livraisonId);
};

export const deleteLivraison = async (livraisonId) => {
  return await axios.delete(LIVRAISON_API + '/' + livraisonId);
};

export const addLivraison = async (livraison) => {
  return await axios.post(LIVRAISON_API, livraison);
};

export const editLivraison = (livraison) => {
  return axios.put(LIVRAISON_API + '/' + livraison._id, livraison);
};

// Recherche de livraisons par titre
export const searchLivraisonsByTitle = async (searchTerm) => {
  try {
    return await axios.get(`${LIVRAISON_API}/search`, {
      params: { title: searchTerm }
    });
  } catch (error) {
    console.error("Erreur lors de la recherche de méthodes de livraison:", error);
    throw error;
  }
};