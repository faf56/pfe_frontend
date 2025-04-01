import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { addmarque } from "../../service/marqueservice";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Insertmarque = ({ show, handleClose, handleAddmarque }) => {
  const [marque, setMarque] = useState({
    nommarque: '',
    imagemarque: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fonction pour gérer l'upload de l'image sur Cloudinary en utilisant fetch
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'test2025'); // Remplacer par votre propre preset Cloudinary
    data.append('cloud_name', 'dr09h69he'); // Remplacer par votre cloud name

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dr09h69he/image/upload', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error('Échec de l\'upload de l\'image');
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw error;
    }
  };

  // Configuration du serveur FilePond pour l'upload des images
  const serverOptions = {
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      uploadImageToCloudinary(file)
        .then((imageUrl) => {
          setMarque((prevMarque) => ({
            ...prevMarque,
            imagemarque: imageUrl, // Ajouter l'URL de l'image à la marque
          }));
          load(imageUrl);
        })
        .catch((err) => {
          error('Échec du téléchargement de l\'image');
          abort();
        });
    },
  };

  // Fonction de soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation: Check if the name is not empty
    if (!marque.nommarque) {
      setErrorMessage('Le nom de la marque est requis');
      return;
    }

    setLoading(true);
    try {
      await addmarque(marque).then((res) => handleAddmarque(res.data));
      handleClose(); // Close the modal after successful submission
      setMarque({ nommarque: '', imagemarque: '' }); // Reset the state
      setFiles([]); // Clear files in FilePond
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      setErrorMessage('Erreur lors de l\'ajout de la marque');
      console.error('Erreur lors de l\'ajout de la marque :', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Modal show={show} onHide={handleClose}>
        <form className="marque-form" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <h2>Ajouter Marque</h2>
          </Modal.Header>

          <Modal.Body>
            {errorMessage && <div className="error-message">{errorMessage}</div>}

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
                  required
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
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              className="form-reset-button"
              onClick={() => handleClose()}
            >
              Annuler
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Insertmarque;
