import axios from "../api/axios";
const ORDER_API="/orders"

export const fetchOrders = async () => {
  return await axios.get(ORDER_API);
};

export const fetchOrderById = async (orderId) => {
  return await axios.get(ORDER_API + '/' + orderId);
};

export const deleteOrder = async (orderId) => {
  return await axios.delete(ORDER_API + '/' + orderId);
};

export const addOrder = async (orderData) => {
  try {
    // Ajout de logs pour déboguer
    console.log("Données envoyées au serveur:", orderData)
    return await axios.post(ORDER_API, orderData)
  } catch (error) {
    console.error("Erreur détaillée:", error.response?.data || error.message)
    throw error
  }
}

export const editOrder = (order) => {
  return axios.put(ORDER_API + '/' + order._id, order);
};

// Récupérer les commandes d'un utilisateur spécifique
export const fetchOrdersByUser = async (userId) => {
  return await axios.get(`${ORDER_API}/user/${userId}`);
};

// Mettre à jour le statut d'une commande
// Correction
export const updateOrderStatus = async (orderId, status) => {
  return await axios.put(`${ORDER_API}/${orderId}/status`, { statut: status }); // ✅ méthode PUT et propriété correcte
};


// Recherche de commandes
export const searchOrders = async (searchTerm) => {
  try {
    return await axios.get(`${ORDER_API}/search`, {
      params: { q: searchTerm }
    });
  } catch (error) {
    console.error("Erreur lors de la recherche de commandes:", error);
    throw error;
  }
};



// Fonction pour annuler une commande
export const cancelOrder = async (orderId) => {
  return await axios.put(`${ORDER_API}/${orderId}/cancel`);
};