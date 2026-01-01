import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import deleteSvg from "../assets/delete.svg";
import soldSVG from "../assets/soldIcon.svg";
import Verified from "../assets/verified.svg";
export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const textStat = useRef();
  const sellBtn = useRef();
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      let response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
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
        `${import.meta.env.VITE_API_URL}/gets/username`,
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
        `${import.meta.env.VITE_API_URL}/delete/${key}`,
        {
          method: "DELETE",
          headers: { token: localStorage.token },
        }
      );
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert("حدث خطأ، الرجاء إعادة المحاولة");
    }
  };

  const handleSell = async (key) => {
    try {
      console.log(key);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/setSold/${key}`,
        {
          method: "DELETE",
          headers: { token: localStorage.token },
        }
      );
      if (response.ok) {
        alert("سيظهر المنتج على انه مباع");
        sellBtn.current.style.display = "none";
      }
    } catch (error) {
      alert("حدث خطأ، الرجاء إعادة المحاولة");
    }
  };

  const checkAuthorization = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/is-authorized`,
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
              navigate(`/products/${product.id}`);
            }}
          >
            <img
              className="product-image"
              src={`${import.meta.env.VITE_API_URL}/image/${product.id}/0`}
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
              title="حذف"
              className="dltBtn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product.id);
              }}
            >
              <img src={deleteSvg} width="30px" alt="delete" />
            </button>
            {product.state != "sold" && (
              <button
                ref={sellBtn}
                title="تم البيع"
                className="dltBtn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSell(product.id);
                }}
                style={{ backgroundColor: "green" }}
              >
                <img src={soldSVG} width="30px" alt="delete" />
              </button>
            )}
          </div>
        ))}
        <h1 style={{ textAlign: "center" }} ref={textStat}>
          انتهت النتائج
        </h1>
      </div>
    </>
  );
}
