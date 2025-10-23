import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Uploud from "./components/upload";
import GetProducts from "./components/get-products";
import Register from "./components/register";
import Login from "./components/login";
import GetSaved from "./components/get-saved";
import ProductDetails from "./components/productDetails";
import UserProducts from "./components/userSells";
import SearchProducts from "./components/serachProduct";
import UuidInput from "./components/idSearch";

import menu from "./assets/hamburger.svg";
import logo from "./assets/soow.png";
import home from "./assets/home.svg";
import searchSvg from "./assets/search.svg";
import bookmarksvg from "./assets/bookmark.svg";
import profileSvg from "./assets/account.svg";
import logoutSvg from "./assets/logout.svg";
import SVGlogo from "./assets/sooqSyria.svg";
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
            <Link
              className="siteLinkOut"
              onClick={() => setIsOn((prev) => !prev)}
            >
              <img
                style={{
                  width: "40px",
                  userSelect: "none",
                }}
                src={menu}
                alt=""
              />
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
              src={SVGlogo}
              alt="sooqsyria"
              style={{ width: "80px", height: "80px" }}
            />
          </div>
        )}
      </div>

      <div
        className="sidebar"
        style={{ display: isOn ? "block" : "none", position: "absolute" }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={SVGlogo} alt="logo" width="60%" />
        </div>

        <Link to={"/"} className="sidebarBtn">
          <img src={home} alt="" />
          الصفحة الرئيسية
        </Link>
        <Link to={"/search"} className="sidebarBtn">
          <img src={searchSvg} alt="" />
          البحث
        </Link>
        <Link
          to={"/IDSearch"}
          className="sidebarBtn"
          style={{ direction: "rtl" }}
        >
          البحث برمز UUID
        </Link>
        <Link to={"/getSaved"} className="sidebarBtn">
          <img src={bookmarksvg} alt="" />
          المحفوظة
        </Link>
        <Link to={"/profile"} className="sidebarBtn">
          <img src={profileSvg} alt="" />
          الملف الشخصي
        </Link>
        <Link
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            window.location.reload();
          }}
          className="sidebarBtn"
        >
          <img src={logoutSvg} alt="" />
          تسجيل الخروج
        </Link>
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
        <Route path="/IDSearch" element={<UuidInput />} />
      </Routes>
    </>
  );
}
