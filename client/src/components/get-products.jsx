import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function GetProducts() {
  const [products, setProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState(99999999);
  const [catFilter, setCatFilter] = useState("type");
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      let response = await fetch("https://battal-shopping.onrender.com/list", {
        method: "POST",
        body: JSON.stringify({ catFilter, priceFilter }),
        headers: { "content-type": "application/json" },
      });
      let jsonData = await response.json();
      console.log(jsonData);
      setProducts(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  const checkAuthorization = async () => {
    try {
      const response = await fetch(
        "https://battal-shopping.onrender.com/auth/is-authorized",
        {
          method: "GET",
          headers: {
            token: localStorage.token,
          },
        }
      );

      if (response.ok) {
        console.log("ok"); // Fixed the if statement
      } else {
        navigate("/register");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  useEffect(() => {
    checkAuthorization();

    getProducts();
  }, []);

  return (
    <>
      <div className="filterCont">
        <div>
          <span className="filterName">الفئة</span>
          <select
            className="fileterSelect"
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="electronics">الكترونيات</option>
            <option value="cars">سيارات</option>
            <option value="sports">الرياضة</option>
            <option value="houseProducts">مستلزمات المنزل</option>
            <option value="decoration">قطع زينة</option>
          </select>
        </div>
        <div>
          <span>السعر</span>
          <select
            className="fileterSelect"
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="99999999">الكل</option>
            <option value="1000000">تحت 1000000</option>
            <option value="100000"> تحت 100000</option>
            <option value="50000">تحت 50000</option>
          </select>
        </div>
      </div>

      <div className="products-list">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-cont"
            onClick={() => {
              alert(
                `رقم البائع: \n +963 ${product.uploader_number}\n تاريخ التنزيل: \n ${product.date}`
              );
            }}
          >
            <img
              className="product-image"
              src={`https://battal-shopping.onrender.com/image/${product.id}`}
              alt={product.name}
            />
            <div className="product-details">
              <span className="product-name">{product.name}</span>
              <span className="product-disc">{product.discription}</span>
              <span className="product-type">{product.type}</span>
              <span className="product-price">{product.price} SP</span>
              <span className="product-date">{product.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
