import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import {fetchcategories} from "../../service/categorieservice"
import {editscategorie} from "../../service/scategorieservice"

import axios from "../../api/axios"


const Editscategorie = ({show,handleClose,sca,handleUpdateScategorie}) => {
  const[scategorie,setScategorie]=useState(sca)
  const[categories,setCategories]=useState([])
  const [files, setFiles] = useState([]);

  const loadcategories=async()=>{
  try {
  const res = await fetchcategories()
  setCategories(res.data);
  console.log(res.data)
  } catch (error) {
  console.log(error);
  }
  }
  useEffect(() => {
  loadcategories()
  setFiles( [
    {
    source: sca.imagesca,
    options: { type: 'local' }
    }
    ])
  }, [])
const handleUpdate = async(event) => {
event.preventDefault();
// Logique pour soumettre le formulaire
await editscategorie(scategorie).then(res=>handleUpdateScategorie(res.data))
handleClose()
// Réinitialiser les champs du formulaire
setScategorie({})
};

  return (
    <div className="form-container">
    <Modal show={show} onHide={handleClose}>
    <form className="article-form">
    <Modal.Header closeButton>
    <h2>Modifier Sous Categorie</h2>
    </Modal.Header>
    
    <Modal.Body>
    <div className="form-grid">
    <div className="form-group">
    <label htmlFor="title">Sous Categorie</label>
    <input
    type="text"
    id="nomscategorie"
    value={scategorie.nomscategorie}
    onChange={(e) => setScategorie({...scategorie,nomscategorie:e.target.value})}
    className="form-input"
    placeholder="Entrez référence article"
    />
    </div>
    
    <div className="form-group">
    <label htmlFor="prix">Catégorie</label>
    <select
    id="nomcategorie"
    className="form-control"
    value={scategorie.categorieID}
    onChange={(e) => setScategorie({...scategorie,categorieID:e.target.value})}
    >
    {categories.map((cat,index)=>
    <option key={index} value={cat._id}>{cat.nomcategorie}</option>
    )}
    </select>
    </div>
    
    </div>
    </Modal.Body>
    <Modal.Footer>
    <button type="button" className="form-submit-button"
    onClick={(e)=>handleUpdate(e)}>Update</button>
    <button type="reset" className="form-reset-button"
    onClick={()=>handleClose()}>Annuler</button>
    </Modal.Footer>
    </form>
    </Modal>
    </div>
  )
}

export default Editscategorie
