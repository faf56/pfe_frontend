import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { editmarque } from "../../service/marqueservice";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Editmarque = ({ show, handleClose, mar, handleUpdateMarque }) => {
  const [marque, setMarque] = useState(mar);
  const [files, setFiles] = useState([]);

  // Initialiser les fichiers FilePond avec l'image existante
  useEffect(() => {
    setFiles([
      {
        source: mar.imagemarque,
        options: { type: 'local' }
      }
    ]);
  }, [mar]);

  // Fonction pour mettre à jour la marque
  const handleUpdate = async (event) => {
    event.preventDefault();

    // Vérifier si un fichier a été téléchargé
    if (files.length > 0 && files[0].file) {
      const imageUrl = await uploadImageToCloudinary(files[0].file);
      setMarque((prevMarque) => ({ ...prevMarque, imagemarque: imageUrl }));
    }

    // Soumettre la marque modifiée
    try {
      await editmarque(marque);
      handleUpdateMarque(marque); // Mettre à jour la liste des marques dans le parent
      handleClose(); // Fermer le modal
      setMarque({}); // Réinitialiser le formulaire
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la marque:', error);
    }
  };

  // Fonction pour uploader l'image vers Cloudinary en utilisant fetch
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'Ecommerce_cloudinary'); // Remplacer par ton propre preset
    data.append('cloud_name', 'iset-sfax'); // Remplacer par ton cloud name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/iset-sfax/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        return result.secure_url; // Retourner l'URL de l'image
      } else {
        throw new Error('Échec de l\'upload de l\'image');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error; // Lancer une exception en cas d'erreur
    }
  };

  // Configuration du serveur FilePond
  const serverOptions = {
    load: (source, load, error, progress, abort, headers) => {
      fetch(source)
        .then((response) => response.blob())
        .then((myBlob) => load(myBlob))
        .catch((err) => error('Erreur lors du chargement de l\'image'));
    },
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      uploadImageToCloudinary(file)
        .then((imageUrl) => {
          setMarque((prevMarque) => ({ ...prevMarque, imagemarque: imageUrl }));
          load(imageUrl);
        })
        .catch((err) => {
          error('Échec du téléchargement de l\'image');
          abort();
        });
    },
  };

  return (
    <div className="form-container">
      <Modal show={show} onHide={handleClose}>
        <form className="article-form" onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <h2>Modifier Marque</h2>
          </Modal.Header>

          <Modal.Body>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nommarque">Nom Marque</label>
                <input
                  type="text"
                  id="nommarque"
                  value={marque.nommarque}
                  onChange={(e) => setMarque({ ...marque, nommarque: e.target.value })}
                  className="form-input"
                  placeholder="Entrez le nom de la marque"
                />
              </div>

              <div style={{ width: '100%', margin: 'auto', padding: '1%' }}>
                <FilePond
                  files={files}
                  acceptedFileTypes="image/*"
                  onupdatefiles={setFiles}
                  allowMultiple={false} // Autoriser une seule image
                  server={serverOptions}
                  name="file"
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="submit"
              className="form-submit-button"
            >
              Mettre à jour
            </button>
            <button
              type="button"
              className="form-reset-button"
              onClick={handleClose}
            >
              Annuler
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Editmarque;
