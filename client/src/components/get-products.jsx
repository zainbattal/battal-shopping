import React from "react";
import { useEffect } from "react";
import { useState } from "react";
export default function GetProducts() {
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
      let response = await fetch("https://battal-shopping.onrender.com/list");
      let jsonData = await response.json();
      console.log(jsonData);
      setProducts(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
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
              <span className="product-price">{product.price} SP</span>
              <span className="product-date">{product.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
