import { BrowserRouter as Router,Routes, Route, Outlet } from "react-router-dom";
import '@mui/material/styles';
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartProvider } from "use-shopping-cart";

// Layouts
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";


// Pages principales
import Homebody from "./pages/Homebody";
import ProductCard from "./pages/ProductCard";

// Produits
import Insertproduit from "./components/produits/Insertproduit";
import Listproduit from "./components/produits/Listproduit";
import Editproduit from "./components/produits/Editproduit";
// Catégories
import Listcategorie from "./components/categories/Listcategorie";
import Insertcategorie from "./components/categories/Insertcategorie";
import Editcategorie from "./components/categories/Editcategorie";
// Sous-catégories
import Listscategorie from "./components/scategories/Listscategorie";
import Insertscategorie from "./components/scategories/Insertscategorie";
import Editscategorie from "./components/scategories/Editscategorie";
// Marques
import Listmarque from "./components/marques/Listmarque";
import Insertmarque from "./components/marques/Insertmarque";
import Editmarque from "./components/marques/Editmarque";

// Authentification
import Login from "./components/authentification/Login";
import Logout from "./components/authentification/Logout";
import Register from "./components/authentification/Register";



import AdminHome from "./components/admin/AdminHome";
import ProductAdmin from "./components/admin/ProductAdmin";
import CategoryAdmin from "./components/admin/CategoryAdmin";
import ScategoryAdmin from "./components/admin/ScategoryAdmin";
import MarqueAdmin from "./components/admin/MarqueAdmin";
import OrderAdmin from "./components/admin/OrderAdmin";
import UserAdmin from "./components/admin/UserAdmin";
import Page from "./pages/Page";
import ProductsPage from "./pages/ProductsPage";

// 🔹 Layout Principal (avec Header et Footer)
const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);



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
          <Route path="/page" element={<Page/>} />
          <Route path="/product" element={<ProductsPage/>} />
          
        </Route>

        {/* 🔹 Routes Admin (avec Sidebar) */}
        <Route path="/admin" element={<AdminHome />}/>
        <Route path="/products" element={<ProductAdmin />} />
        <Route path="/category" element={<CategoryAdmin />} />
        <Route path="/scategory" element={<ScategoryAdmin />} />
        <Route path="/marque" element={<MarqueAdmin />} />
        <Route path="/orders" element={<OrderAdmin />} />
        <Route path="/users" element={<UserAdmin />} />
        
        
          
          
        
          <Route path="/produits" element={<Listproduit />} />
          <Route path="/produits/add" element={<Insertproduit />} />
          <Route path="/produits/edit/:id" element={<Editproduit />} />

          <Route path="/categories" element={<Listcategorie />} />
          <Route path="/categories/add" element={<Insertcategorie />} />
          <Route path="/categories/edit/:id" element={<Editcategorie />} />

          <Route path="/scategories" element={<Listscategorie />} />
          <Route path="/scategories/add" element={<Insertscategorie />} />
          <Route path="/scategories/edit/:id" element={<Editscategorie />} />

          <Route path="/marques" element={<Listmarque />} />
          <Route path="/marques/add" element={<Insertmarque />} />
          <Route path="/marques/edit/:id" element={<Editmarque />} />
        <Route path="/products" element={<ProductAdmin />} />
        <Route path="/produits" element={<Listproduit />} />
         
          
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
