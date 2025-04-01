import axios from "../api/axios";
const SCATEGORIE_API="scategories"

export const fetchscategories=async()=> {
return await axios.get(SCATEGORIE_API);
};

export const fetchscategorieById=async(scategorieId)=> {
return await axios.get(SCATEGORIE_API + '/' + scategorieId);
};

export const deletescategorie=async(scategorieId) =>{
return await axios.delete(SCATEGORIE_API + '/' + scategorieId);
};

export const addscategorie=async(scategorie)=> {
return await axios.post(SCATEGORIE_API,scategorie);
};

export const editscategorie=(scategorie) =>{
return axios.put(SCATEGORIE_API + '/' + scategorie._id, scategorie);
};

export const findScategorieByName = async (name) => {
    const response = await fetchScategories();
    return response.data.find(scat => scat.nomscategorie === name);
  };