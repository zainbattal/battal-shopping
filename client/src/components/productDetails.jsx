import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";
export default function ProductDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const imageWrapper = useRef();
  const imageTag = useRef();
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupSrc, setPopupSrc] = useState("");
  const [arrayNum, setArrayNum] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const handleImageClick = () => {
    setPopupSrc(
      `https://battal-shopping.onrender.com/image/${post.id}/${currentIndex}`
    );
    setPopupVisible(true);
  };

  const GetProduct = async () => {
    const res = await fetch("https://battal-shopping.onrender.com/getOne", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    let jsonData = await res.json();
    setPost(jsonData);
    setImageCount(jsonData.image.length);
  };
  useEffect(() => {
    checkAuthorization();
    GetProduct();
  }, []);

  let imageUrl = "";
  if (post) {
    imageUrl = `https://battal-shopping.onrender.com/image/${post.id}/${currentIndex}`;
  }

  if (!post) {
    return <p>Loading...</p>; // Show a loading message until data is available
  }

  return (
    <>
      {popupVisible && (
        <div
          onClick={() => setPopupVisible(false)}
          className="refImageDiv"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={popupSrc}
            alt="product zoom"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </div>
      )}

      <div className="fullDetails">
        <div className="detailDiv">
          <h3 className="DetailsName">{post.name}</h3>
          <span className="DetailsSpan">الوصف:</span>
          <p className="DetailsDisc">{post.discription}</p>
          <span className="DetailsSpan">اسم المستخدم:</span>
          <p className="DetailsUsername">{post.uploader}</p>
          <span className="DetailsSpan">{"رقم الستخدم (اضغط للنسخ):"}</span>
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
          <div
            className="image-carousel"
            style={{ position: "relative", textAlign: "center" }}
          >
            {/* Image Display */}
            <img
              src={imageUrl}
              alt={`product ${currentIndex}`}
              style={{ maxWidth: "100%", cursor: "default" }}
              onError={(e) => (e.target.style.display = "none")}
            />

            {/* Navigation Buttons */}
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
                  }}
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
