import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Home from "./components/main-page";
import Uploud from "./components/upload";
import GetProducts from "./components/get-products";
import "./App.css";

export function App() {
  return (
    <>
      <div className="siteNav">
        <Link className="siteLink" to={"/"}>
          Home
        </Link>
        <Link className="siteLink" to={"/upload"}>
          Sell
        </Link>
      </div>

      <Routes>
        <Route path="/upload" element={<Uploud />} />
        <Route path="/" element={<GetProducts />} />
      </Routes>
    </>
  );
}
