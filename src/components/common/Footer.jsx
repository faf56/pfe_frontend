import "./Header.css";

import { Container, Row, Col, Image } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Header.css"
import { Link } from "react-router-dom"
import { LocalShipping, Refresh, VerifiedUser, Payments } from "@mui/icons-material"


const Footer = () => {
  return (
    <>
      {/* Section des avantages */}
      <div className="advantages-section">
        <Container>
          <Row className="text-center">
            <Col xs={12} sm={6} md={3} className="advantage-item">
              <div className="advantage-icon">
                <LocalShipping />
              </div>
              <h5 className="advantage-title">Livraison Rapide en 24H-48H</h5>
            </Col>

            <Col xs={12} sm={6} md={3} className="advantage-item">
              <div className="advantage-icon">
                <Refresh />
              </div>
              <h5 className="advantage-title">Retour sous 14 Jours</h5>
            </Col>

            <Col xs={12} sm={6} md={3} className="advantage-item">
              <div className="advantage-icon">
                <VerifiedUser />
              </div>
              <h5 className="advantage-title">100% Produits Authentiques</h5>
            </Col>

            <Col xs={12} sm={6} md={3} className="advantage-item">
              <div className="advantage-icon">
                <Payments />
              </div>
              <h5 className="advantage-title">Payement à la Livraison</h5>
            </Col>
          </Row>
        </Container>
      </div>

      <footer className="footer">
        <Container>
          {/* Row 2 avec logo à gauche */}
          <Row className="align-items-center">
            {/* Colonne pour le logo */}
            <Col md={2}>
              <Link to="/">
                <Image
                  src="https://res.cloudinary.com/dr09h69he/image/upload/v1741911068/463019960_419264451219385_8982093036609537258_n-removebg-preview-removebg-preview_btllrt.png"
                  alt="Logo"
                  fluid
                  className="footer-logo img-fluid"
                />
              </Link>
            </Col>

            {/* Colonne pour les informations */}
            <Col md={3}>
              <h5>PERLA COIF</h5>
              <p>
                Boutique de vente de produits cosmétiques, maquillage, accessoires de beauté et matériels professionnels
                à usage cosmétiques.
              </p>
            </Col>

            <Col md={3}>
              <h5>
                <i className="fa-regular fa-clock fa-lg"></i> HORAIRE
              </h5>
              <p>Lundi - Vendredi : 9:00h -19:30h </p>
              <p>Samedi : 9h -16h</p>
            </Col>
            <Col md={4}>
              <h5> Nos coordonnées</h5>
              <p>
                <i className="fa-solid fa-location-dot"></i>
                <i> Kassas Nº5 entre Rte Ain et Afrane, Sfax, Tunisia</i>
              </p>
              <p>
                <i className="fa-regular fa-envelope"></i>{" "}
                <u>
                  <a href="#" className="text-dark mx-2">
                    steperlacoiff@gmail.com
                  </a>
                </u>
              </p>
              <p>
                <i className="fa-solid fa-phone"></i>
                <i> (+216) 29 810 530</i>
              </p>
            </Col>
          </Row>
          <div className="separator"></div>

          {/* Row 3 pour le copyright */}
          <Row className="align-items-center">
            <Col xs={12} sm={6} className="text-center text-sm-left">
            <p>&copy; {new Date().getFullYear()} Perla Coif. Tous droits réservés.</p>
            </Col>

            {/* Icônes des réseaux sociaux */}
            <Col xs={12} sm={6} className="text-center text-sm-right">
              <a href="https://www.facebook.com/profile.php?id=100094074991303" className="text-dark mx-2">
                <i className="fa-brands fa-facebook fa-2xl"></i>
              </a>
              <a href="https://www.instagram.com/perlacoiff/?hl=fr" className="text-dark mx-2">
                <i className="fa-brands fa-instagram fa-2xl"></i>
              </a>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer
