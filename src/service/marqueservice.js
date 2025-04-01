import axios from "../api/axios";
const MARQUE_API="/marques"

export const fetchmarques=async()=> {
return await axios.get(MARQUE_API);
}

export const fetchmarqueById=async(marqueId)=> {
return await axios.get(MARQUE_API + '/' + marqueId);
}

export const deletemarque=async(marqueId) =>{
return await axios.delete(MARQUE_API + '/' + marqueId);
}

export const addmarque=async(marque)=> {
return await axios.post(MARQUE_API,marque);
}

export const editmarque=(marque) =>{
return axios.put(MARQUE_API + '/' + marque._id, marque);
}