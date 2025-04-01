import React, {useEffect, useState} from "react"
import Affichescategorie from './Affichescategorie';
import { CircularProgress } from '@mui/material';
import { fetchscategories, deletescategorie } from '../../service/scategorieservice';
import Insertscategorie from './Insertscategorie';

const Listscategorie = () => {
const [scategories, setScategories] = useState([]);
const [error, setError] = useState(null);
const [isPending, setIsPending] = useState(true);
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const getscategories = async () => {
try {
const res = await fetchscategories()
setScategories(res.data);
} catch (error) {
console.log(error);
setError(error);
}
finally {
setIsPending(false);
}
};
useEffect(() => {
getscategories();
}, []);
const handleAddscategorie=(newscategorie)=>{
setScategories([newscategorie,...scategories])
}
const handleDeleteScategorie = async(scategorieId) => {
    try {
    if(window.confirm("confirmer la suppression"))
    {
    await deletescategorie(scategorieId)
    .then(()=> setScategories(scategories.filter((scategorie) => scategorie._id !== scategorieId)))

    
    }
    } catch (error) {
    console.log(error)
    }
    }
const handleUpdateScategorie = (scateg) => {
setScategories(scategories.map((scategorie) =>scategorie._id === scateg._id ? scateg : scategorie));
};

return (
<div >
<button className="new" onClick={handleShow}>
<i className="fa-solid fa-plus-square"></i> Nouveau Sous Categorie
</button>
{isPending ? (
<div>
<CircularProgress color="primary" size={60} />
</div>
) : error ? (
<div>Erreur lors du chargement des sous categories</div>
) : (
<div>
<h1><center>Liste des sous categorie</center></h1>
<Affichescategorie scategories={scategories} handleDeleteScategorie={handleDeleteScategorie} handleUpdateScategorie={handleUpdateScategorie} />
</div>

)}
{
  show && <Insertscategorie
  show={show}
  handleClose={handleClose}
  handleAddscategorie={handleAddscategorie}
  />
}
</div>

)
}

export default Listscategorie
