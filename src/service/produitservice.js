import axios from "../api/axios";

const PRODUIT_API="produits"

export const fetchproduits=async()=>{
    return await axios.get(PRODUIT_API);
}

export const fetchproduitById=async(produitId)=>{
    return await axios.get(PRODUIT_API + '/' + produitId);
}
export const deleteproduit=async(produitId) =>{
    return await axios.delete(PRODUIT_API + '/' + produitId);
    }
export const addproduit=async(produit)=> {
    return await axios.post(PRODUIT_API, produit);
    }
export const editproduit=(produit) =>{
    return axios.put(PRODUIT_API + '/' + produit._id, produit);
    }

export const fetchnewproduit = async () => {
    return await axios.get(PRODUIT_API + '/new');
};
export const fetchProduitsByScategorie = async (scategorieId) => {
    return await axios.get(PRODUIT_API + '/scategorie/' + scategorieId);
};
export const fetchProduitsByMarque = async (marqueId) => {
    return await axios.get(PRODUIT_API + '/marque/' + marqueId);
};

// Nouvelle fonction pour la recherche globale
export const searchProduits = async (searchTerm) => {
    try {
        return await axios.get(`${PRODUIT_API}/search`, {
            params: { q: searchTerm }
        });
    } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        throw error; // Propager l'erreur pour la gérer dans le composant
    }
};
