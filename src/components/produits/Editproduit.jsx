import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import {fetchscategories} from "../../service/scategorieservice";
import {fetchmarques} from "../../service/marqueservice";
import {editproduit} from "../../service/produitservice";
import { FilePond,registerPlugin} from 'react-filepond'
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)


const Editproduit = ({show,handleClose,pro,handleUpdateProduct}) => {

  const[produit,setProduit]=useState(pro)
  const[scategories,setScategories]=useState([])
  const[marques,setMarques]=useState([])
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadscategories=async()=>{
    try {
    const res = await fetchscategories()
    setScategories(res.data);
    console.log(res.data)
    } catch (error) {
    console.log(error);
    }
    }
    const loadmarques=async()=>{
      try {
      const res = await fetchmarques()
      setMarques(res.data);
      console.log(res.data)
      } catch (error) {
      console.log(error);
      }
      }
      useEffect(() => {
        loadscategories();
        loadmarques();
      }, []);
    
      useEffect(() => {
        if (pro) {
          setProduit({
            ...pro,
            marqueID: pro.marqueID?._id || '',
            scategorieID: pro.scategorieID?._id || '',
          });
      
          // Si une image existe, l'ajouter à l'état des fichiers
          setFiles([
            {
              source: pro.imagepro,
              options: { type: 'local' }
            }
          ]);
        }
      }, [pro]);
         
      const handleUpdate = async (event) => {
        event.preventDefault();
        console.log("Produit avant mise à jour : ", produit);
        setLoading(true);
        
        try {
          await editproduit(produit).then(res => handleUpdateProduct(res.data));
          handleClose();
          setProduit({});
          setFiles([]);
        } catch (error) {
          console.error("Erreur lors de la modification du produit :", error);
        }
    
        setLoading(false);
      };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'perlaimg');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dr09h69he/image/upload', {
        method: 'POST',
        body: data
      });
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Erreur upload image :", error);
      return null;
    }
  };
  const serverOptions = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      uploadImageToCloudinary(file)
        .then((imageUrl) => {
          if (imageUrl) {
            setProduit((prevProduit) => ({ ...prevProduit, imagepro: imageUrl }));
            load(imageUrl);
          } else {
            error("Échec de l'upload de l'image.");
            abort();
          }
        })
        .catch((err) => {
          console.error("Erreur upload image :", err);
          error("Échec de l'upload de l'image.");
          abort();
        });
    }
  };
  return (
<div className="form-container">
      <Modal show={show} onHide={handleClose}>
        <form className="article-form">
          <Modal.Header closeButton>
            <h2>Modifier Produit</h2>
          </Modal.Header>

          <Modal.Body>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Nom</label>
                <input
                  type="text"
                  id="title"
                  value={produit.title}
                  onChange={(e) => setProduit({ ...produit, title: e.target.value })}
                  className="form-input"
                  placeholder="Entrez le nom du produit"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Désignation</label>
                <input
                  type="text"
                  id="description"
                  value={produit.description}
                  onChange={(e) => setProduit({ ...produit, description: e.target.value })}
                  className="form-input"
                  placeholder="Entrez la désignation du produit"
                />
              </div>
              <div className="form-group">
                <label htmlFor="marque">Marque</label>
                <select
                  id="marque"
                  className="form-control"
                  value={produit.marqueID}
                  onChange={(e) => setProduit({ ...produit, marqueID: e.target.value })}
                >
                  <option value="">Sélectionner une marque</option>
                  {marques.map((marq) => (
                    <option key={marq._id} value={marq._id}>
                      {marq.nommarque}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="stock">Quantité</label>
                <input
                  type="number"
                  id="stock"
                  value={produit.stock}
                  onChange={(e) => setProduit({ ...produit, stock: e.target.value })}
                  className="form-input"
                  placeholder="Entrez la quantité en stock"
                />
              </div>
              <div className="form-group">
                <label htmlFor="prix">Prix</label>
                <input
                  type="number"
                  required
                  id="prix"
                  value={produit.prix}
                  onChange={(e) => setProduit({ ...produit, prix: e.target.value })}
                  className="form-input"
                  placeholder="Entrez le prix"
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Catégorie</label>
                <select
                  id="category"
                  className="form-control"
                  value={produit.scategorieID}
                  onChange={(e) => setProduit({ ...produit, scategorieID: e.target.value })}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {scategories.map((scat) => (
                    <option key={scat._id} value={scat._id}>
                      {scat.nomscategorie}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: "80%", margin: "auto", padding: "1%" }}>
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  server={serverOptions}
                  name="file"
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" onClick={(e)=>handleUpdate(e)} disabled={loading} className="btn btn-primary">
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" onClick={()=>handleClose()} className="btn btn-secondary">
              Annuler
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}

export default Editproduit
