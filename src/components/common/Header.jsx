"use client"

import { FaSearch } from "react-icons/fa"
import "./Header.css"
import PersonIcon from "@mui/icons-material/Person"
import { Chip } from "@mui/material"
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { styled } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined"
import EmailIcon from '@mui/icons-material/Email';
import CartDrawer from "../cart/CartDrawer"
import { useState, useEffect } from "react"
import { useShoppingCart } from "use-shopping-cart"
import { fetchcategories } from "../../service/categorieservice"

const CartBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -1,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#ff5160",
  },
}))

const Header = () => {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState([])

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const { cartCount } = useShoppingCart()

  // Charger les catégories au chargement du composant
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchcategories()
        setCategories(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
      }
    }

    loadCategories()
  }, [])

  // Fonction pour filtrer par catégorie
  const handleCategoryClick = (categoryId, categoryName) => {
    navigate("/product", {
      state: {
        filter: "category",
        id: categoryId,
        value: categoryName,
      },
    })
  }

  // Fonction pour filtrer par sous-catégorie
  const handleSubcategoryClick = (subcategoryName) => {
    navigate("/product", {
      state: {
        filter: "subcategory",
        value: subcategoryName,
      },
    })
  }

  // Fonction pour gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      navigate("/product", {
        state: {
          filter: "search",
          value: searchTerm.trim(),
        },
      })
    }
  }

  return (
    <header>
      <div className="promo-banner">
        <span className="left">
          <i className="fa fa-phone"></i> (+216) 21 298 233
        </span>
        <span className="center">
          <i className="fa-solid fa-truck-fast"></i> Livraison gratuite à partir de 99 DT d'achat
        </span>
        <span className="right" onClick={() => navigate("/contact")} >
          
          <EmailIcon/> CONTACT
          
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

        <form className="search-bar" onSubmit={handleSearch}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit, une marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Recherche"
          />
          <button type="submit" className="search-button">
            Rechercher
          </button>
        </form>

        <div className="header-icons">
          <div className="icon-item">
            <Chip
              className="se-connecter"
              icon={<PersonIcon />}
              label="Mon Compte"
              variant="outlined"
              onClick={() => navigate("/mon-compte")}
            />
          </div>
          <i className="fa-regular fa-heart fa-xl"></i>

          <IconButton onClick={toggleCartDrawer} aria-label="Panier">
            <ShoppingCartIcon fontSize="large" sx={{ color: "black" }} />
            <CartBadge badgeContent={cartCount} overlap="circular" />
          </IconButton>
        </div>
      </div>

      <Navbar expand="lg" className="navbar">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="navbar-nav">
            <Nav.Link href="/">Acceuil</Nav.Link>
            {/*<Nav.Link href="/allproduct">Product</Nav.Link>*/}
            <Nav.Link href="/promo">Promo</Nav.Link>

            {/* Menu Teint */}
            <NavDropdown
              title="Teint"
              id="nav-dropdown-teint"
              onClick={(e) => {
                if (e.target.id === "nav-dropdown-teint") {
                  // Trouver l'ID de la catégorie Teint
                  const teintCategory = categories.find((cat) => cat.nomcategorie === "Teint")
                  if (teintCategory) {
                    handleCategoryClick(teintCategory._id, "Teint")
                  }
                }
              }}
            >
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Base de teint")}>Base de teint</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Blush & Highlighter")}>
                Blush & Highlighter
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick(" Pinceaux & Eponges")}>
                Pinceaux & Eponges
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Yeux"
              id="nav-dropdown-yeux"
              onClick={(e) => {
                if (e.target.id === "nav-dropdown-yeux") {
                  const yeuxCategory = categories.find((cat) => cat.nomcategorie === "Yeux")
                  if (yeuxCategory) {
                    handleCategoryClick(yeuxCategory._id, "Yeux")
                  }
                }
              }}
            >
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Mascara")}>Mascaras</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Palettes")}>Palettes</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Crayons yeux")}>Crayons</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Lèvres"
              id="nav-dropdown-levres"
              onClick={(e) => {
                if (e.target.id === "nav-dropdown-levres") {
                  const levresCategory = categories.find((cat) => cat.nomcategorie === "Lèvres")
                  if (levresCategory) {
                    handleCategoryClick(levresCategory._id, "Lèvres")
                  }
                }
              }}
            >
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Rouge à levres")}>
                Rouges à lèvres
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Gloss")}>Gloss</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Crayons levre")}>
                Crayons à lèvres
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Ongles"
              id="nav-dropdown-ongles"
              onClick={(e) => {
                if (e.target.id === "nav-dropdown-ongles") {
                  const onglesCategory = categories.find((cat) => cat.nomcategorie === "Ongles")
                  if (onglesCategory) {
                    handleCategoryClick(onglesCategory._id, "Ongles")
                  }
                }
              }}
            >
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Verni normal")}>Verni normal</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Verni permenent")}>
                Verni permanent
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Accesoires ongles")}>
                Accessoires ongles
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Cheveux"
              id="nav-dropdown-cheveux"
              onClick={(e) => {
                if (e.target.id === "nav-dropdown-cheveux") {
                  const cheveuxCategory = categories.find((cat) => cat.nomcategorie === "Cheveux")
                  if (cheveuxCategory) {
                    handleCategoryClick(cheveuxCategory._id, "Cheveux")
                  }
                }
              }}
            >
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Shampoing")}>Shampoing</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Soin cheveux")}>Soin cheveux</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Accesoires cheveux")}>
                Accessoires
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title="Soin"
              id="nav-dropdown-soin"
              onClick={(e) => {
                if (e.target.id === "nav-dropdown-soin") {
                  const soinCategory = categories.find((cat) => cat.nomcategorie === "Soin")
                  if (soinCategory) {
                    handleCategoryClick(soinCategory._id, "Soin")
                  }
                }
              }}
            >
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Soin visage")}>Soin visage</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Soin corps")}>Soin corps</NavDropdown.Item>
              <NavDropdown.Item onClick={() => handleSubcategoryClick("Parfum & Brume")}>
                Parfum & Brume
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/marques">Marques</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </header>
  )
}

export default Header
