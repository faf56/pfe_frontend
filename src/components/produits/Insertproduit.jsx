import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { fetchscategories } from "../../service/scategorieservice";
import { fetchmarques } from '../../service/marqueservice';
import { addproduit } from "../../service/produitservice";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import axios from '../../api/axios';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Insertproduit = ({ show, handleClose, handleAddproduct, pro }) => {
  const [produit, setProduit] = useState({
    title: '',
    description: '',
    marqueID: '',
    scategorieID: '',
    stock: 0,
    prix: 0,
    imagepro: ''
  });

  const [scategories, setScategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadscategories = async () => {
    try {
      const res = await fetchscategories();
      setScategories(res.data);
    } catch (error) {
      console.log("Erreur lors du chargement des catégories : ", error);
    }
  };

  const loadmarques = async () => {
    try {
      const res = await fetchmarques();
      setMarques(res.data);
    } catch (error) {
      console.log("Erreur lors du chargement des marques : ", error);
    }
  };

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
        imagepro: pro.imagepro || ''
      });

      setFiles(pro.imagepro ? [{ source: pro.imagepro, options: { type: 'local' } }] : []);
    }
  }, [pro]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!produit.title || !produit.description || !produit.marqueID || !produit.scategorieID || produit.stock <= 0 || produit.prix <= 0) {
        alert("Tous les champs doivent être remplis correctement.");
        setLoading(false);
        return;
      }

      await addproduit(produit).then((res) => {
        handleAddproduct(res.data);
      });
      handleClose();
      setProduit({
        title: '',
        description: '',
        marqueID: '',
        scategorieID: '',
        stock: 0,
        prix: 0,
        imagepro: ''
      });
      setFiles([]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      setLoading(false);
    }
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
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("Échec de l'upload de l'image.");
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
      throw error;
    }
  };

  const serverOptions = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      uploadImageToCloudinary(file)
        .then((imageUrl) => {
          setProduit((prevProduit) => ({ ...prevProduit, imagepro: imageUrl }));
          load(imageUrl);
        })
        .catch((err) => {
          error("Erreur d'upload d'image");
          abort();
        });
    }
  };

  return (
    <div className="form-container">
      <Modal show={show} onHide={handleClose}>
        <form className="article-form" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <h2>Ajouter Produit</h2>
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
                  placeholder="Entrez le nom de l'article"
                  required
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
                  placeholder="Entrez la désignation de l'article"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="marque">Marque</label>
                <select
                  id="marque"
                  className="form-control"
                  value={produit.marqueID}
                  onChange={(e) => setProduit({ ...produit, marqueID: e.target.value })}
                  required
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
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="prix">Prix</label>
                <input
                  type="number"
                  id="prix"
                  value={produit.prix}
                  onChange={(e) => setProduit({ ...produit, prix: e.target.value })}
                  className="form-input"
                  placeholder="Entrez le prix"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Catégorie</label>
                <select
                  id="category"
                  className="form-control"
                  value={produit.scategorieID}
                  onChange={(e) => setProduit({ ...produit, scategorieID: e.target.value })}
                  required
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button onClick={handleClose}>Annuler</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Insertproduit;
