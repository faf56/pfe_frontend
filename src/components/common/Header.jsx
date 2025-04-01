import { FaSearch, FaHeart } from "react-icons/fa";
import "./Header.css";
import PersonIcon from '@mui/icons-material/Person';
import { Chip } from "@mui/material";
import { Navbar, Nav, NavDropdown,  } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartDrawer from "../cart/CartDrawer"
import { useState } from "react";
import { useShoppingCart } from 'use-shopping-cart';



const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    background-color: #DA4C4CFF;
    color: #ffffff;
    top: -12px;
    right: -6px;
  }
`;
const Header = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const { cartCount} = useShoppingCart();
  // Fonction pour filtrer par sous-catégorie
  const handleSubcategoryClick = (subcategoryName) => {
    navigate("/product", { 
      state: { 
        filter: 'subcategory',
        value: subcategoryName 
      } 
    });
  };
  return (
    <header>
      <div className="promo-banner">
        <span className="left">
          <i className="fa fa-phone"></i> (+216) 21 298 233
        </span>
        <span className="center">
          <i className="fa-solid fa-truck-fast"></i> Livraison gratuite à partir de 99 DT d'achat
        </span>
      </div>

      <div className="header-main">
        <div className="logo">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dr09h69he/image/upload/v1741823420/463973226_419263521219478_9170913468475389171_n_vlsgxl.png"
              alt="Logo Perla Coif"
            />
          </Link>
        </div>

        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Rechercher un produit, une marque..." />
        </div>

        <div className="header-icons">
          <div className="icon-item">
            <Chip
              className="se-connecter"
              icon={<PersonIcon />}
              label="Se connecter"
              variant="outlined"
              onClick={() => navigate("/login")}
            />
          </div>
          <i className="fa-regular fa-heart fa-xl"></i>
          <IconButton onClick={toggleCartDrawer}>
            <ShoppingCartIcon fontSize="large" sx={{ color: "black" }} />
            <CartBadge badgeContent={cartCount}  overlap="circular"  />
          </IconButton>
        </div>
      </div>
      

      <Navbar expand="lg" className="navbar">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="navbar-nav">
            <Nav.Link href="#">Marques</Nav.Link>
            <Nav.Link href="/allproduct">Product</Nav.Link>

            {/* Menu Teint */}
            <NavDropdown title="Teint" id="nav-dropdown-teint">
              <NavDropdown.Item 
                onClick={() => handleSubcategoryClick("Fond de teint")}
              >
                Fond de teint
              </NavDropdown.Item>
              <NavDropdown.Item 
                onClick={() => handleSubcategoryClick("Blush & Highlighter")}
              >
                Blush & Highlighter
              </NavDropdown.Item>
              <NavDropdown.Item 
                onClick={() => handleSubcategoryClick(" Pinceaux & Eponges")}
              >
                Pinceaux & Eponges
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Yeux" id="nav-dropdown-yeux">
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Mascara")}>Mascaras</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Palettes")}>Palettes</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Crayons yeux")}>Crayons</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Lèvres" id="nav-dropdown-levres">
              <NavDropdown.Item onClick={() => handleSubcategoryClick("rouge à levres")}>Rouges à lèvres</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("gloss")}>Gloss</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("crayons levre")}>Crayons à lèvres</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Ongles" id="nav-dropdown-ongles">
              <NavDropdown.Item onClick={() => handleSubcategoryClick("verni normal")}>Verni normal</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("verni permenent")}>Verni permanent</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("accesoires ongles")}>Accessoires ongles</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Cheveux" id="nav-dropdown-cheveux">
              <NavDropdown.Item onClick={() => handleSubcategoryClick("shampoing")}>Shampoing</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("soin cheveux")}>Soin cheveux</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("accesoires cheveux")}>Accessoires</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Soin" id="nav-dropdown-soin">
              <NavDropdown.Item onClick={() => handleSubcategoryClick("soin visage")}>Soin visage</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("soin corps")}>Soin corps</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("parfum & brume")}>Parfum & brume</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>
    </header>
  );
};

export default Header;
