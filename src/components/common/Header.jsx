"use client"

import { FaSearch } from "react-icons/fa"
import "./Header.css"
import PersonIcon from "@mui/icons-material/Person"
import { Chip } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { styled } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined"
import EmailIcon from "@mui/icons-material/Email"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import CartDrawer from "../cart/CartDrawer"
import { useState, useEffect, useRef } from "react"
import { useCart } from "react-use-cart"
import { fetchcategories } from "../../service/categorieservice"
import { fetchscategories } from "../../service/scategorieservice"

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
  const [subcategories, setSubcategories] = useState([])
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  const timeoutRef = useRef(null)

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const { totalItems } = useCart()

  // Charger les catégories et sous-catégories au chargement du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catResponse, subcatResponse] = await Promise.all([fetchcategories(), fetchscategories()])
        setCategories(catResponse.data)
        setSubcategories(subcatResponse.data)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    loadData()
  }, [])

  // Fonction pour filtrer par catégorie
  const handleCategoryClick = (categoryId, categoryName) => {
    console.log("Filtrage par catégorie:", categoryId, categoryName)
    navigate("/product", {
      state: {
        filter: "category",
        id: categoryId,
        value: categoryName,
      },
    })
    setMobileMenuOpen(false)
  }

  // Fonction pour filtrer par sous-catégorie
  const handleSubcategoryClick = (subcategoryName) => {
    console.log("Filtrage par sous-catégorie:", subcategoryName)
    navigate("/product", {
      state: {
        filter: "subcategory",
        value: subcategoryName,
      },
    })
    setMobileMenuOpen(false)
  }

  // Fonction pour obtenir les sous-catégories d'une catégorie
  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter((subcat) => subcat.categorieID && subcat.categorieID._id === categoryId)
  }

  // Fonction pour gérer le survol d'une catégorie
  const handleCategoryHover = (categoryId) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredCategory(categoryId)
  }

  // Fonction pour gérer la sortie du survol d'une catégorie
  const handleCategoryLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCategory(null)
    }, 200) // Délai pour éviter la fermeture trop rapide
  }

  // Gérer l'expansion des catégories dans le menu mobile
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // Fermer le menu mobile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  // Empêcher le défilement du body quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

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
          <i className="fa fa-phone"></i> (+216) 95 326 015
        </span>
        <span className="center">
          <i className="fa-solid fa-truck-fast"></i> Livraison gratuite à partir de 99 DT d'achat
        </span>
        <span className="right" onClick={() => navigate("/contact")}>
          <EmailIcon /> CONTACT
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
          <input
            type="text"
            placeholder="Rechercher "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Recherche"
          />
          <button type="submit" className="search-button">
            <FaSearch className="search-icon" />
          </button>
        </form>

        <div className="header-icons">
          <div className="icon-item">
            <Chip
              id="compte"
              className="se-connecter"
              icon={<PersonIcon />}
              label="Mon Compte"
              variant="outlined"
              onClick={() => navigate("/mon-compte")}
            />
          </div>

          <IconButton onClick={() => navigate("/favoris")} aria-label="Favoris">
            <FavoriteBorderIcon fontSize="medium" sx={{ color: "black" }} />
          </IconButton>
          <IconButton onClick={toggleCartDrawer} aria-label="Panier">
            <ShoppingCartIcon fontSize="large" sx={{ color: "black" }} />
            <CartBadge badgeContent={totalItems} overlap="circular" />
          </IconButton>
        </div>
      </div>

      {/* Bouton du menu mobile */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Navigation desktop */}
      <nav className="modern-nav">
        <div className="nav-container">
          <div className="nav-item">
            <Link to="/" className="nav-link">
              ACCUEIL
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/promo" className="nav-link">
              PROMOS
            </Link>
          </div>
          

          {/* Générer dynamiquement les menus de catégories */}
          {categories.map((category) => {
            const subcats = getSubcategoriesForCategory(category._id)
            return subcats.length > 0 ? (
              <div
                key={category._id}
                className={`nav-item has-dropdown ${hoveredCategory === category._id ? "active" : ""}`}
                onMouseEnter={() => handleCategoryHover(category._id)}
                onMouseLeave={handleCategoryLeave}
              >
                <div
                  className="nav-link with-arrow"
                  onClick={() => handleCategoryClick(category._id, category.nomcategorie)}
                >
                  {category.nomcategorie.toUpperCase()}
                  <KeyboardArrowDownIcon className="dropdown-icon" />
                </div>

                <div className="dropdown-menu">
                  {subcats.map((subcat) => (
                    <div
                      key={subcat._id}
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSubcategoryClick(subcat.nomscategorie)
                      }}
                    >
                      {subcat.nomscategorie.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={category._id} className="nav-item">
                <div className="nav-link" onClick={() => handleCategoryClick(category._id, category.nomcategorie)}>
                  {category.nomcategorie.toUpperCase()}
                </div>
              </div>
            )
          })}

          <div className="nav-item">
            <Link to="/marques" className="nav-link">
              MARQUES
            </Link>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div className={`mobile-menu-container ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} aria-label="Fermer le menu">
            <CloseIcon />
          </button>
        </div>

        <nav className="mobile-menu-nav">
          <ul className="mobile-menu-list">
            <li className="mobile-menu-item">
              <a href="/" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                ACCUEIL
              </a>
            </li>
            <li className="mobile-menu-item">
              <a href="/promo" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                PROMOS
              </a>
            </li>
            <li className="mobile-menu-item">
              <a href="/new" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                NEW
              </a>
            </li>

            {categories.map((category) => (
              <li key={category._id} className="mobile-menu-item">
                <div className="mobile-menu-category">
                  <a
                    href="#"
                    className="mobile-menu-link"
                    onClick={(e) => {
                      e.preventDefault()
                      handleCategoryClick(category._id, category.nomcategorie)
                    }}
                  >
                    {category.nomcategorie.toUpperCase()}
                  </a>
                  {getSubcategoriesForCategory(category._id).length > 0 && (
                    <button
                      className="mobile-menu-expand"
                      onClick={() => toggleCategory(category._id)}
                      aria-label={`Développer ${category.nomcategorie}`}
                    >
                      {expandedCategories[category._id] ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowDownIcon className="collapsed" />
                      )}
                    </button>
                  )}
                </div>

                {expandedCategories[category._id] && (
                  <ul className="mobile-submenu">
                    {getSubcategoriesForCategory(category._id).map((subcat) => (
                      <li key={subcat._id} className="mobile-submenu-item">
                        <a
                          href="#"
                          className="mobile-submenu-link"
                          onClick={(e) => {
                            e.preventDefault()
                            handleSubcategoryClick(subcat.nomscategorie)
                          }}
                        >
                          {subcat.nomscategorie.toUpperCase()}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li className="mobile-menu-item">
              <a href="/marques" className="mobile-menu-link" onClick={() => setMobileMenuOpen(false)}>
                MARQUES
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </header>
  )
}

export default Header
