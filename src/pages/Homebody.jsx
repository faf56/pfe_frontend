
import { useEffect, useState } from "react"

import Card from "../components/card/Card"
import { Carousel, Row, Col } from "react-bootstrap"
import { fetchnewproduit, fetchpromoproduit } from "../service/produitservice"
import { Container, Grid, Paper, Typography } from "@mui/material"
import {
  CreditCard as PaymentIcon,
  LocalOffer as PriceIcon,
  LocalShipping as ShippingIcon,
  HeadsetMic as SupportIcon,
} from "@mui/icons-material"
import "../components/card/card.css"
import "./Homebody.css"

const Homebody = () => {
  const [produits, setProduit] = useState([])
  const [promoProducts, setPromoProducts] = useState([])
  const [loadingPromo, setLoadingPromo] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await fetchnewproduit()
      setProduit(res.data)
    } catch (error) {
      console.log("Erreur lors du chargement des nouveaux produits:", error)
    }
  }

  const fetchPromoProducts = async () => {
    try {
      setLoadingPromo(true)
      const res = await fetchpromoproduit()
      setPromoProducts(res.data)
    } catch (error) {
      console.log("Erreur lors du chargement des produits en promotion:", error)
    } finally {
      setLoadingPromo(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchPromoProducts()
  }, [])

  const chunkArray = (array, size) => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  const productChunks = chunkArray(produits, 4)
  const promoProductChunks = chunkArray(promoProducts, 4)

  return (
    <>
      <div>
        <Carousel className="carousel" indicators={false}>
        <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1745007157/d5297e5493cc9f71a07ddfa253af9e00787b2301_sliders_web_revolution_make_up_beauty_store_h2thhi.jpg"
              alt="babylise"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823201/bb623e6235a01a6e4df7e939cf0a372db624b202_sliders_web_essence_nouvaut%C3%A9_2025_daek4w.jpg"
              alt="essance"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823200/e9c221edb244bb633aada0dcce602608c24f7b6a_sliders_web_babyliss_beauty_store_sqyisw.jpg"
              alt="babylise"
            />
          </Carousel.Item>
        
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823202/e8c683a5418f25423424b0774c77d6e863bd66e9_sliders_web_revolution_make_up_beauty_store_fe6qbq.jpg"
              alt="revolution"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823202/53693405438cb4b7a10c5c451711cb1df3b5535c_sliders_web_svr_beauty_store_fojpe0.jpg"
              alt="Third slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823202/64d326698ba055259b9946920658a7b9b959ff3e_sliders_web_artdeco_lncvjj.jpg"
              alt="artdeco"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823202/9df5b2f68a8b1b27c77d1191b3a59fefe9d9d429_sliders_web_bioderma_df3jyr.jpg"
              alt="bioderma"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823203/a3a9717cceb7d86197c025f919224accdc368349_sliders_rose_baie_beauty_store_okenem.jpg"
              alt="rosebaie"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823203/39e2fe171f4e28cca96ebf3ecc0d57a89800072c_sliders_web_e6jcwc.jpg"
              alt="Third slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Section des services */}
      <div className="services-section">
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className="service-card">
                <div className="service-icon">
                  <PaymentIcon fontSize="large" />
                </div>
                <Typography variant="h6" className="service-title">
                  Paiement sécurisé
                </Typography>
                <Typography variant="body2" className="service-description">
                  Paiement 100% sécurisé à la livraison
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper className="service-card">
                <div className="service-icon">
                  <PriceIcon fontSize="large" />
                </div>
                <Typography variant="h6" className="service-title">
                  Meilleurs prix
                </Typography>
                <Typography variant="body2" className="service-description">
                  Bénéficiez du prix le plus bas dans la marché tunisien
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper className="service-card">
                <div className="service-icon">
                  <ShippingIcon fontSize="large" />
                </div>
                <Typography variant="h6" className="service-title">
                  Livraison Gratuite
                </Typography>
                <Typography variant="body2" className="service-description">
                  Dès 100 DT d'achat dans toute la Tunisie
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper className="service-card">
                <div className="service-icon">
                  <SupportIcon fontSize="large" />
                </div>
                <Typography variant="h6" className="service-title">
                  Service client
                </Typography>
                <Typography variant="body2" className="service-description">
                  Contactez-nous sur : (+216) 95 326 015
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className="new-container">
        <h2 className="title_new">NOUVEAUX PRODUITS</h2>
        <Carousel indicators={false} interval={3000}>
          {productChunks.map((chunk, index) => (
            <Carousel.Item key={index}>
              <Row className="card-container display-center ">
                {chunk.map((pro, idx) => (
                  <Col key={idx}>
                    <Card
                      key={pro._id}
                      _id={pro._id}
                      imagepro={pro.imagepro}
                      title={pro.title}
                      description={pro.description}
                      prix={pro.prix}
                      prixPromo={pro.prixPromo}
                      stock={pro.stock}
                      marqueID={pro.marqueID}
                    />
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="promo-container">
        <h2 className="title_promo">PRODUITS EN PROMO</h2>
        {loadingPromo ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des promotions...</p>
          </div>
        ) : promoProducts.length === 0 ? (
          <div className="no-products">
            <p>Aucun produit en promotion actuellement</p>
          </div>
        ) : (
          <Carousel indicators={false} interval={3000}>
            {promoProductChunks.map((chunk, index) => (
              <Carousel.Item key={index}>
                <Row className="card-container display-center ">
                  {chunk.map((pro, idx) => (
                    <Col key={idx}>
                      <Card
                        key={pro._id}
                        _id={pro._id}
                        imagepro={pro.imagepro}
                        title={pro.title}
                        description={pro.description}
                        prix={pro.prix}
                        prixPromo={pro.prixPromo}
                        stock={pro.stock}
                        marqueID={pro.marqueID}
                      />
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
    </>
  )
}

export default Homebody
