import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Uploud from "./components/upload";
import GetProducts from "./components/get-products";
import Register from "./components/register";
import Login from "./components/login";
import GetSaved from "./components/get-saved";
import ProductDetails from "./components/productDetails";
import UserProducts from "./components/userSells";
import SearchProducts from "./components/serachProduct";
import logo from "./assets/soow.png";
import "./App.css";
import { useEffect } from "react";

export function App() {
  const [isOn, setIsOn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      window.location.href = "/register";
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    console.log(isOn);
  }, [isOn]);

  return (
    <>
      <div>
        {!hideNavbar && (
          <div className="siteNav">
            <Link className="siteLinkOut" onClick={setIsOn((prev) => !prev)}>
              show sidebar
            </Link>

            <Link className="siteLinkPro" to={"/profile"}>
              الملف الشخصي
            </Link>
            <Link className="siteLink" to={"/upload"}>
              بيع منتجك
            </Link>
            <Link className="siteLink" to={"/search"}>
              البحث
            </Link>
            <Link className="siteLink" to={"/"}>
              الصفحة الرئيسية
            </Link>
            <img
              src={logo}
              alt="sooqsyria"
              style={{ width: "80px", height: "80px" }}
            />
          </div>
        )}

        <div className="sidebar" style={{ display: "none" }}>
          <button className="sidebarBtn"></button>
          <button className="sidebarBtn"></button>
          <button className="sidebarBtn"></button>
          <button className="sidebarBtn"></button>
        </div>
      </div>

      <Routes>
        <Route path="/profile" element={<UserProducts />} />
        <Route path="/upload" element={<Uploud />} />
        <Route path="/" element={<GetProducts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchProducts />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/getSaved" element={<GetSaved />} />
      </Routes>
    </>
  );
}
