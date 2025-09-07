import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function SearchProducts() {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const searchStatus = useRef();
  const getProducts = async (e) => {
    try {
      e.preventDefault();
      const body = { input };
      let response = await fetch(
        "https://battal-shopping.onrender.com/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      let jsonData = await response.json();
      console.log(jsonData);
      searchStatus.current.innerText = "إنتهت النتائج";
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
  }, []);

  return (
    <>
      <form
        onSubmit={getProducts}
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <input
          className="search-input"
          placeholder="ابحث"
          type="text"
          onChange={(e) => setInput(e.target.value)}
        />
        <input className="search-submit" type="submit" value={"بحث"} />
      </form>

      <div className="products-list">
        {products &&
          products.length > 0 &&
          products.map((product) => (
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
                <span className="product-price">{product.price} SYP</span>
                <span className="product-date">{product.date}</span>
              </div>
            </div>
          ))}
        <h1 ref={searchStatus}>ابحث عن شيء</h1>
      </div>
    </>
  );
}
