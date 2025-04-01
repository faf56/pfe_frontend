import React, {useEffect, useState} from "react"
import Affichecategorie from './Affichecategorie';
import { CircularProgress } from '@mui/material';
import { fetchcategories, deletecategorie } from '../../service/categorieservice';
import Insertcategorie from './Insertcategorie';

const Listcategorie = () => {
const [categories, setCategories] = useState([]);
const [error, setError] = useState(null);
const [isPending, setIsPending] = useState(true);
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const getcategories = async () => {
try {
const res = await fetchcategories()
setCategories(res.data);
} catch (error) {
console.log(error);
setError(error);
}
finally {
setIsPending(false);
}
};
useEffect(() => {
getcategories();
}, []);
const handleAddcategorie=(newcategorie)=>{
setCategories([newcategorie,...categories])
}
const handleDeleteCategorie = async(categorieId) => {
    try {
    if(window.confirm("confirmer la suppression"))
    {
    await deletecategorie(categorieId)
    .then(()=> setCategories(categories.filter((categorie) => categorie._id !== categorieId)))

    
    }
    } catch (error) {
    console.log(error)
    }
    }
const handleUpdateCategorie = (catego) => {
setCategories(categories.map((categorie) =>categorie._id === catego._id ? catego : categorie));
};

return (
<div >
<button className="new" onClick={handleShow}>
<i className="fa-solid fa-plus-square"></i> Nouveau Categorie
</button>
{isPending ? (
<div>
<CircularProgress color="primary" size={60} />
</div>
) : error ? (
<div>Erreur lors du chargement des categories</div>
) : (
<div>
<h1><center>Liste des categorie</center></h1>
<Affichecategorie categories={categories} handleDeleteCategorie={handleDeleteCategorie} handleUpdateCategorie={handleUpdateCategorie} />
</div>

)}
{
  show && <Insertcategorie
  show={show}
  handleClose={handleClose}
  handleAddcategorie={handleAddcategorie}
  />
}
</div>

)
}

export default Listcategorie
