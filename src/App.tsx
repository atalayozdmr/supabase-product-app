import { Routes, Route, Link } from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import AddProduct from "./features/products/AddProduct";
import ProductsList from "./features/products/ProductsList";
import LogoutButton from "./components/LogoutButton";
import { useAuthUser } from "./hooks/useAuthUser";
import EditProduct from "./features/products/EditProduct";
function App() {
  const user = useAuthUser();

  return (
    <div className="p-8">
      <nav className="space-x-4 mb-6" style={{ display: "flex", alignItems: "center" }}>
        <Link to="/products">Ürünler</Link>
        {user && <Link to="/add-product">Ürün Ekle</Link>}
        {!user && <Link to="/login">Giriş</Link>}
        {!user && <Link to="/register">Kayıt Ol</Link>}
        {user && (
          <span style={{ marginLeft: 15, color: "#222", fontWeight: 600 }}>
            Hoş geldin, <span style={{ color: "#2166e7" }}>{user.email}</span>
          </span>
        )}
        {user && <LogoutButton />}
      </nav>
     <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/add-product" element={<AddProduct />} />
  <Route path="/products" element={<ProductsList />} />
  <Route path="/edit-product/:id" element={<EditProduct />} />  {/* <-- Bunu ekle */}
  <Route path="*" element={<ProductsList />} />
</Routes>
    </div>
  );
}

export default App;
