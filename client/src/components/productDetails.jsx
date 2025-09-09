import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const GetProduct = async () => {
    const res = await fetch("https://battal-shopping.onrender.com/getOne", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    let jsonData = await res.json();
    setPost(jsonData);
  };
  useEffect(() => {
    GetProduct();
  }, []);
  if (post)
    return (
      <>
        <div>
          <img src={`https://battal-shopping.onrender.com/image/${id}`} />
          <h3>{post.name}</h3>
          <p>{post.discription}</p>
          <p>{post.type}</p>
          <p>{post.price}</p>
          <p>{post.date}</p>
        </div>
      </>
    );
}
