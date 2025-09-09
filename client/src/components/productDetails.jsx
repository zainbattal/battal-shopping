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

  if (!post) {
    return <p>Loading...</p>; // Show a loading message until data is available
  }

  return (
    <>
      <div className="detailDiv">
        <h3 className="DetailsName">{post.name}</h3>

        <div className="infoRow">
          <span className="DetailsSpan">الوصف:</span>
          <p className="DetailsDisc">{post.discription}</p>
        </div>

        <div className="infoRow">
          <span className="DetailsSpan">اسم المستخدم:</span>
          <p className="DetailsUsername">{post.uploader}</p>
        </div>

        <div className="infoRow">
          <span className="DetailsSpan">رقم المستخدم:</span>
          <p className="DetailsNumber">{post.uploader_number}</p>
        </div>

        <div className="infoRow">
          <span className="DetailsSpan">الفئة:</span>
          <p className="DetailsType">{post.type}</p>
        </div>

        <div className="infoRow">
          <span className="DetailsSpan">المدينة:</span>
          <p className="DetailsCity">{post.city}</p>
        </div>

        <div className="infoRow">
          <span className="DetailsSpan">السعر:</span>
          <p className="DetailsPrice">{post.price} ر.س</p>
        </div>

        <p className="DetailsDate">{post.date}</p>
      </div>
    </>
  );
}
