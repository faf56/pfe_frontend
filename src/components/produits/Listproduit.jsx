import React, {Suspense, useEffect, useState } from 'react'
import Afficheproduit from './Afficheproduit';
import { CircularProgress } from '@mui/material';
import {fetchproduits,deleteproduit} from '../../service/produitservice';
import Insertproduit from './Insertproduit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Chip from '@mui/material/Chip';
import PrintIcon from '@mui/icons-material/Print';


const Listproduit = () => {
  const [produits, setProduits] = useState([]);
const [error, setError] = useState(null);
const [isPending, setIsPending] = useState(true);
const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const getproduits = async () => {
try {
const res = await fetchproduits()
setProduits(res.data);
} catch (error) {
console.log(error);
setError(error);
}
finally {
setIsPending(false);
}
};
useEffect(() => {
  getproduits();
  }, []);
const handleAddproduct=(newproduit)=>{
    setProduits([newproduit,...produits])
}
const handleDeleteProduct = async(productId) => {
  try {
  if(window.confirm("confirmer la suppression"))
  
  {
  await deleteproduit(productId)
  .then(res=>setProduits(produits.filter((product) => product._id !== productId)))
  
  }
  } catch (error) {
  console.log(error)
  }
  }
  const handleUpdateProduct = (prmod) => {
    setProduits(produits.map((product) =>product._id === prmod._id ? prmod : product));
    };
  return (
    
    <div className="table-container-header">
    <Button className="new" onClick={handleShow}>
    <i className="fa-solid fa-plus-square"></i> Nouveau
    </Button>
    {isPending ? (
    <div>
    <CircularProgress color="primary" size={60} />
    </div>
    ) : error ? (
    <div>Erreur lors du chargement des produits</div>
    ) : (
    <div>
    <h1><center>Liste des produits</center></h1>
    
    <Chip
            label="Imprimer"
            onClick={() => window.print()}
            icon={<PrintIcon />}
            variant="outlined"
            color="success"
          />

    <Afficheproduit produits={produits} handleDeleteProduct={handleDeleteProduct} handleUpdateProduct={handleUpdateProduct}/>
    </div>
    )}
    {show && <Insertproduit
      show={show}
      handleClose={handleClose}
      handleAddproduct={handleAddproduct}
    /> }

</div>
  )
}

export default Listproduit
