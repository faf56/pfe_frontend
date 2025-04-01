import React, {useEffect, useState} from "react"
import Affichemarque from './Affichemarque';
import { CircularProgress } from '@mui/material';
import { fetchmarques, deletemarque } from '../../service/marqueservice';
import Insertmarque from './Insertmarque';

const Listmarque = () => {
const [marques, setMarques] = useState([]);
const [error, setError] = useState(null);
const [isPending, setIsPending] = useState(true);
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const getmarques = async () => {
try {
const res = await fetchmarques()
setMarques(res.data);
} catch (error) {
console.log(error);
setError(error);
}
finally {
setIsPending(false);
}
};
useEffect(() => {
getmarques();
}, []);
const handleAddmarque=(newmarque)=>{
setMarques([newmarque,...marques])
}
const handleDeleteMarque = async(marqueId) => {
    try {
    if(window.confirm("confirmer la suppression"))
    {
    await deletemarque(marqueId)
    .then(()=> setMarques(marques.filter((marque) => marque._id !== marqueId)))

    
    }
    } catch (error) {
    console.log(error)
    }
    }
const handleUpdateMarque = (marq) => {
setMarques(marques.map((marque) =>marque._id === marq._id ? marq : marque));
};

return (
<div >
<button className="new" onClick={handleShow}>
<i className="fa-solid fa-plus-square"></i> Nouveau marque
</button>
{isPending ? (
<div>
<CircularProgress color="primary" size={60} />
</div>
) : error ? (
<div>Erreur lors du chargement des marques</div>
) : (
<div>
<h1><center>Liste des marque</center></h1>
<Affichemarque marques={marques} handleDeleteMarque={handleDeleteMarque} handleUpdateMarque={handleUpdateMarque} />
</div>

)}
{
  show && <Insertmarque
  show={show}
  handleClose={handleClose}
  handleAddmarque={handleAddmarque}
  />
}
</div>

)
}

export default Listmarque
