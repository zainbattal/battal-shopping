import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import deleteSvg from "../assets/delete.svg";
export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const textStat = useRef();
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      let response = await fetch(
        "https://battal-shopping.onrender.com/profile",
        {
          method: "GET",
          headers: { token: localStorage.token },
        }
      );
      let jsonData = await response.json();
      console.log(jsonData);
      setProducts(jsonData);
      if (products.length == 0) {
        console.log("no products");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUsername = async () => {
    try {
      const response = await fetch(
        "https://battal-shopping.onrender.com/gets/username",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            token: localStorage.token, // send the JWT token here
          },
        }
      );
      let jsonData = await response.json();
      console.log(jsonData);
      setUsername(jsonData.user_name);
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
    getUsername();

    getProducts();
  }, []);

  return (
    <>
      <h1
        className="loadingText"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
          marginTop: "100px",
          gap: "10px", // optional: space between texts
          flexWrap: "wrap", // optional: wrap if screen is small
          marginTop: "30px",
        }}
      >
        <span style={{ direction: "rtl" }}>أهلاً بك</span>
        <span className="username" style={{ direction: "ltr" }}>
          {username}
        </span>
      </h1>

      <div className="products-list">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-cont"
            onClick={() => {
              navigate(`products/${product.id}`);
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
            <button className="dltBtn" onClick={() => handleDelete(product.id)}>
              <img src={deleteSvg} width="30px" alt="delete" />
            </button>
          </div>
        ))}
        <h1 style={{ textAlign: "center" }} ref={textStat}>
          انتهت النتائج
        </h1>
      </div>
    </>
  );
}
