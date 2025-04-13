import React, { useEffect, useState } from 'react'


import "../components/card/card.css";
import Card from '../components/card/Card';
import { Carousel, Row, Col } from "react-bootstrap";
import {fetchnewproduit} from "../service/produitservice"

const Homebody = () => {
    const [produits, setProduit] = useState([]);
    const fetchProducts = async () => {
        try {
          const res = await fetchnewproduit();
          setProduit(res.data);
    
        }catch (error){
          console.log(error);
        }
      };
    useEffect(()=>{
      fetchProducts();
    },[]);

    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };
  
    const productChunks = chunkArray(produits, 5);
  return (
    <>
    <div>
    
      <Carousel className="carousel" indicators={false}>
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

    <div className="best-sellers-container">
        <h2 className="title">N O U V E A U X    P R O D U I T S</h2>
        <Carousel indicators={false} interval={3000}>
          {productChunks.map((chunk, index) => (
            <Carousel.Item key={index}>
              <Row className="card-container display-center ">
                {chunk.map((pro, idx) => (
                  <Col key={idx} >
                    <Card
                      key={pro._id}
                      _id={pro._id}
                      imagepro={pro.imagepro}
                      title={pro.title}
                      description={pro.description} // Ajoutez cette ligne
                      prix={pro.prix}
                      stock={pro.stock} // Ajoutez cette ligne
                      marqueID={pro.marqueID}
                    />
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  )
}

export default Homebody
