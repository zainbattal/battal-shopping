import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bookmarkRemove from "../assets/bookmark_remove.svg";

export default function UserProducts() {
  const [products, setProducts] = useState([]);

  const textStat = useRef();
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      let response = await fetch(
        "https://battal-shopping.onrender.com/gets/getSaved",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );

      const data = await response.json();
      console.log(data.saved_products);

      let response2 = await fetch(
        "https://battal-shopping.onrender.com/gets/getProductsSaved",
        {
          body: JSON.stringify({ data2: data.saved_products }),
          method: "POST",
          headers: { "content-type": "application/json" },
        }
      );
      const data2 = await response2.json();
      setProducts(data2);
      console.log(data2);
      textStat.current.innerText = "انتهت النتائج";
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (key) => {
    try {
      console.log(key);
      const response = await fetch(
        `https://battal-shopping.onrender.com/delete/${key}`,
        {
          method: "DELETE",
          headers: { token: localStorage.token },
        }
      );
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error.message);
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
      {
        <div className="products-list">
          {products.map((product) => (
            <div key={product.id} className="product-cont">
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
              <button
                style={{}}
                className="unsaveBtn"
                onClick={() => handleDelete(product.id)}
              >
                <img
                  src={bookmarkRemove}
                  alt="unsave"
                  style={{ width: "30px" }}
                />
              </button>
            </div>
          ))}
          <h1 style={{ textAlign: "center" }} ref={textStat}>
            جار التحميل
          </h1>
        </div>
      }
    </>
  );
}
