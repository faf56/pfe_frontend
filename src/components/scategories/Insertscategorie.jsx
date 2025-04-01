import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { fetchcategories } from "../../service/categorieservice";
import { addscategorie } from "../../service/scategorieservice";

const Insertscategorie = ({ show, handleClose, handleAddscategorie }) => {
  const [scategorie, setScategorie] = useState({
    nomscategorie: "",
    categorieID: ""
  });
  const [categories, setCategories] = useState([]);

  // Charger les catégories
  useEffect(() => {
    const loadcategories = async () => {
      try {
        const res = await fetchcategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories", error);
      }
    };
    loadcategories();
  }, []);

  // Soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!scategorie.nomscategorie || !scategorie.categorieID) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const res = await addscategorie(scategorie);
      handleAddscategorie(res.data);
      handleClose();
      setScategorie({ nomscategorie: "", categorieID: "" }); // Réinitialisation du formulaire
    } catch (error) {
      console.error("Erreur lors de l'ajout de la sous-catégorie", error);
    }
  };

  return (
    <div className="form-container">
      <Modal show={show} onHide={handleClose}>
        <form className="article-form">
          <Modal.Header closeButton>
            <h2>Ajouter Sous-Catégorie</h2>
          </Modal.Header>

          <Modal.Body>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nomscategorie">Sous-Catégorie</label>
                <input
                  type="text"
                  id="nomscategorie"
                  value={scategorie.nomscategorie}
                  onChange={(e) => setScategorie({ ...scategorie, nomscategorie: e.target.value })}
                  className="form-input"
                  placeholder="Entrez le nom de la sous-catégorie"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nomcategorie">Catégorie</label>
                <select
                  id="nomcategorie"
                  className="form-control"
                  value={scategorie.categorieID}
                  onChange={(e) => setScategorie({ ...scategorie, categorieID: e.target.value })}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat._id}>
                      {cat.nomcategorie}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button type="button" className="form-submit-button" onClick={handleSubmit}>
              Sauvegarder
            </button>
            <button type="reset" className="form-reset-button" onClick={handleClose}>
              Annuler
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Insertscategorie;
