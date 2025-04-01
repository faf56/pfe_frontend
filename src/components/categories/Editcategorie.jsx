import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import {editcategorie} from "../../service/categorieservice"
import { FilePond,registerPlugin} from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import axios from "axios"
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
const Editcategorie = ({show,handleClose,cat,handleUpdateCategorie}) => {
  const[categorie,setCategorie]=useState(cat)
  const [files, setFiles] = useState([]);
useEffect(() => {
  
  setFiles( [
    {
    source: cat.imagecategorie,
    options: { type: 'local' }
    }
    ])
  }, [])

  const handleUpdate = async(event) => {
  event.preventDefault();
  // Logique pour soumettre le formulaire
  await editcategorie(categorie).then(res=>handleUpdateCategorie(res.data))
  handleClose()
  // Réinitialiser les champs du formulaire
  setCategorie({})
  };
  const serverOptions = () => {
    return {
    load: (source, load, error, progress, abort, headers) => {
    var myRequest = new Request(source);
    fetch(myRequest).then(function(response) {
    response.blob().then(function(myBlob) {
    load(myBlob);
    });
    });
    },
    process: (fieldName, file, metadata, load, error, progress, abort) => {
    console.log(file)
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'Ecommerce_cloudinary');
    data.append('cloud_name', 'iset-sfax');
    data.append('public_id', file.name);
    axios.post('https://api.cloudinary.com/v1_1/iset-sfax/image/upload', data)
    .then((response) => response.data)
    .then((data) => {
    console.log(data);
    setCategorie({...categorie,imagecategorie:data.url}) ;
    load(data);
    })
    .catch((error) => {
  
    
    console.error('Error uploading file:', error);
    error('Upload failed');
    abort();
    });
    },
    };
    };
  return (
    <div className="form-container">
    <Modal show={show} onHide={handleClose}>
    <form className="article-form">
    <Modal.Header closeButton>
    <h2>Modifier Categorie</h2>
    </Modal.Header>
    
    <Modal.Body>
    <div className="form-grid">
        <div className="form-group">
        <label htmlFor="title">Nom Categorie</label>
        <input
        type="text"
        id="nomcategorie"
        value={categorie.nomcategorie}
        onChange={(e) => setCategorie({...categorie,nomcategorie:e.target.value})}
        className="form-input"
        placeholder="Entrez categorie nom"
        />
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

export default Editcategorie
