import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import "@mui/material/styles"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "@fortawesome/fontawesome-free/css/all.min.css"

// Layouts
import Header from "./components/common/Header"
import Footer from "./components/common/Footer"

// Pages principales
import Homebody from "./pages/Homebody"
import ProductCard from "./pages/ProductCard"
import Checkout from "./pages/Checkout"
import CartPage from "./pages/CartPage"
import ProductDetail from "./pages/ProductDetail"

// Authentification
import Login from "./components/authentification/Login"
import Logout from "./components/authentification/Logout"
import Register from "./components/authentification/Register"

import ProtectedRoute from "./components/authentification/ProtectedRoute"

//client
import MonCompte from "./pages/MonCompte"

//admin
import AdminHome from "./components/admin/AdminHome"
import ProductAdmin from "./components/admin/ProductAdmin"
import CategoryAdmin from "./components/admin/CategoryAdmin"
import ScategoryAdmin from "./components/admin/ScategoryAdmin"
import MarqueAdmin from "./components/admin/MarqueAdmin"
import OrderAdmin from "./components/admin/OrderAdmin"
import UserAdmin from "./components/admin/UserAdmin"

import ProductsPage from "./pages/ProductsPage"
import LivraisonAdmin from "./components/admin/LivraisonAdmin"
import AdminContact from "./components/admin/AdminContact"
import ContactPage from "./components/contact/ContactPage"
import MarqueProduitsPage from "./pages/MarqueProduitsPage"
import MarquesPage from "./pages/MarquesPage"
import ProduitPromo from "./pages/ProduitPromo"
import FavoritesPage from "./pages/FavoritesPage"

import { CartProvider } from "react-use-cart"

// 🔹 Layout Principal (avec Header et Footer)
const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
)

function App() {
  return (
    <div>
      <CartProvider>
        <Router>
          <Routes>
            {/* 🔹 Routes avec Header & Footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Homebody />} />
              <Route path="/allproduct" element={<ProductCard />} />
              <Route path="/promo" element={<ProduitPromo />} />

              <Route path="/marques" element={<MarquesPage />} />
              <Route path="/marques/:id" element={<MarqueProduitsPage />} />
              <Route path="/favoris" element={<FavoritesPage />} />
              <Route path="/product" element={<ProductsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/panier" element={<CartPage />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                <Route path="/mon-compte" element={<MonCompte />} />
              </Route>
            </Route>

            {/* 🔹 Routes Admin (avec Sidebar) */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/products" element={<ProductAdmin />} />
              <Route path="/admin/category" element={<CategoryAdmin />} />
              <Route path="/admin/scategory" element={<ScategoryAdmin />} />
              <Route path="/admin/marque" element={<MarqueAdmin />} />
              <Route path="/admin/orders" element={<OrderAdmin />} />
              <Route path="/admin/users" element={<UserAdmin />} />
              <Route path="/admin/livraison" element={<LivraisonAdmin />} />
              <Route path="/admin/contact" element={<AdminContact />} />
            </Route>

            {/* 🔹 Routes Auth (Accessibles sans Layout spécifique) */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </CartProvider>
    </div>
  )
}

export default App
