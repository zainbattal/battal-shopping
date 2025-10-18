import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [imageCount, setImageCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageWrapper = useRef();
  const imageTag = useRef();

  // Check auth
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

      if (!response.ok) {
        navigate("/register");
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
    }
  };

  // Fetch product
  const GetProduct = async () => {
    try {
      const res = await fetch("https://battal-shopping.onrender.com/getOne", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const jsonData = await res.json();

      if (jsonData) {
        setPost(jsonData);
        setImageCount(jsonData.image?.length || 0);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  useEffect(() => {
    checkAuthorization();
    GetProduct();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  const imageUrl =
    imageCount > 0
      ? `https://battal-shopping.onrender.com/image/${post.id}/${currentIndex}`
      : "";

  return (
    <div className="fullDetails">
      <div className="detailDiv">
        <h3 className="DetailsName">{post.name}</h3>

        <span className="DetailsSpan">الوصف:</span>
        <p className="DetailsDisc">{post.discription}</p>

        <span className="DetailsSpan">اسم المستخدم:</span>
        <p className="DetailsUsername">{post.uploader}</p>

        <span className="DetailsSpan">{"رقم المستخدم (اضغط للنسخ):"}</span>
        <p
          className="DetailsNumber"
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigator.clipboard.writeText(post.uploader_number).then(() => {
              alert("تم نسخ الرقم");
            });
          }}
        >
          {post.uploader_number}
        </p>

        <span className="DetailsSpan">الفئة:</span>
        <p className="DetailsType">{post.type}</p>

        <span className="DetailsSpan">المدينة:</span>
        <p className="DetailsCity">{post.city}</p>

        <span className="DetailsSpan">السعر:</span>
        <p className="DetailsPrice">{post.price} SYP</p>

        <p className="DetailsDate">{post.date}</p>

        {/* Image Carousel */}
        {imageCount > 0 && (
          <div
            className="image-carousel"
            style={{
              position: "relative",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <img
              ref={imageTag}
              src={imageUrl}
              alt={`product ${currentIndex}`}
              style={{ maxWidth: "100%", cursor: "default" }}
              onError={(e) => (e.target.style.display = "none")}
            />

            {imageCount > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    fontSize: "24px",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    fontSize: "24px",
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
