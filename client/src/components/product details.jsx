import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export default function ProductPage(params) {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const GetProduct = async () => {
    const res = fetch("https://battal-shopping.onrender.com/getOne", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: { id },
    });
    let jsonData = await res.json();
    setProducts(jsonData);
  };
  useEffect(() => {
    GetProduct();
  }, []);
  return (
    <>
      <div>
        <img src={`https://battal-shopping.onrender.com/image/${id}`} />
      </div>
    </>
  );
}
